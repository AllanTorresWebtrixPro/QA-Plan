import { pool } from "./index";

/**
 * Minimal, server-only query builder that mirrors the subset of the
 * supabase-js API the existing API routes rely on, backed by Neon via `pg`.
 * Every value is passed as a bound parameter; identifiers are allow-listed.
 */

type DbError = { message: string; code?: string };
type Result<T = any> = { data: T; error: DbError | null; count?: number | null };

const TABLES = new Set([
  "user_profiles",
  "qa_tests",
  "qa_user_test_progress",
  "qa_misc_issues",
  "basecamp_oauth_tokens",
  "test_assignments",
  "misc_issues_with_users",
  "qa_users",
]);

const IDENT = /^[a-z_][a-z0-9_]*$/i;

function ident(name: string) {
  const trimmed = name.trim();
  if (!IDENT.test(trimmed)) throw new Error(`Invalid identifier: ${name}`);
  return `"${trimmed}"`;
}

function toParam(value: unknown) {
  if (value !== null && typeof value === "object" && !(value instanceof Date)) {
    return JSON.stringify(value);
  }
  return value;
}

type Filter = { column: string; op: "eq" | "isnull" | "notnull"; value?: unknown };

class QueryBuilder implements PromiseLike<Result> {
  private action: "select" | "insert" | "update" | "delete" = "select";
  private columns = "*";
  private countOnly = false;
  private filters: Filter[] = [];
  private orders: { column: string; ascending: boolean }[] = [];
  private limitCount: number | null = null;
  private payload: Record<string, unknown>[] | Record<string, unknown> | null = null;
  private returning = false;
  private mode: "many" | "single" | "maybeSingle" = "many";

  constructor(private table: string) {
    if (!TABLES.has(table)) throw new Error(`Unknown table: ${table}`);
  }

  select(columns = "*", options?: { count?: string; head?: boolean }) {
    if (this.action === "select") {
      const cols = columns.trim();
      if (cols === "count" || options?.count) {
        this.countOnly = true;
      } else if (cols !== "*") {
        this.columns = cols.split(",").map(ident).join(", ");
      }
    } else {
      this.returning = true;
    }
    return this;
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]) {
    this.action = "insert";
    this.payload = values;
    return this;
  }

  update(values: Record<string, unknown>) {
    this.action = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push(
      value === null ? { column, op: "isnull" } : { column, op: "eq", value }
    );
    return this;
  }

  not(column: string, operator: string, value: unknown) {
    if (operator === "is" && value === null) {
      this.filters.push({ column, op: "notnull" });
      return this;
    }
    throw new Error(`Unsupported not() operator: ${operator}`);
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orders.push({ column, ascending: options?.ascending ?? true });
    return this;
  }

  limit(count: number) {
    this.limitCount = Math.max(0, Math.floor(count));
    return this;
  }

  single() {
    this.mode = "single";
    return this;
  }

  maybeSingle() {
    this.mode = "maybeSingle";
    return this;
  }

  private buildWhere(params: unknown[]) {
    if (!this.filters.length) return "";
    const parts = this.filters.map((f) => {
      if (f.op === "isnull") return `${ident(f.column)} IS NULL`;
      if (f.op === "notnull") return `${ident(f.column)} IS NOT NULL`;
      params.push(toParam(f.value));
      return `${ident(f.column)} = $${params.length}`;
    });
    return ` WHERE ${parts.join(" AND ")}`;
  }

  private buildSql(): { text: string; params: unknown[] } {
    const params: unknown[] = [];
    const table = ident(this.table);

    if (this.action === "select") {
      const cols = this.countOnly ? "count(*)::int AS count" : this.columns;
      let text = `SELECT ${cols} FROM ${table}${this.buildWhere(params)}`;
      if (!this.countOnly && this.orders.length) {
        text += ` ORDER BY ${this.orders
          .map((o) => `${ident(o.column)} ${o.ascending ? "ASC" : "DESC"}`)
          .join(", ")}`;
      }
      if (!this.countOnly && this.limitCount !== null) {
        text += ` LIMIT ${this.limitCount}`;
      }
      return { text, params };
    }

    const returning = this.returning || this.mode !== "many" ? " RETURNING *" : "";

    if (this.action === "insert") {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload ?? {}];
      const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
      const values = rows.map(
        (row) =>
          `(${keys
            .map((k) => {
              if (!(k in row)) return "DEFAULT";
              params.push(toParam(row[k]));
              return `$${params.length}`;
            })
            .join(", ")})`
      );
      return {
        text: `INSERT INTO ${table} (${keys.map(ident).join(", ")}) VALUES ${values.join(
          ", "
        )}${returning}`,
        params,
      };
    }

    if (this.action === "update") {
      const entries = Object.entries((this.payload ?? {}) as Record<string, unknown>);
      const sets = entries.map(([k, v]) => {
        params.push(toParam(v));
        return `${ident(k)} = $${params.length}`;
      });
      return {
        text: `UPDATE ${table} SET ${sets.join(", ")}${this.buildWhere(params)}${returning}`,
        params,
      };
    }

    return { text: `DELETE FROM ${table}${this.buildWhere(params)}${returning}`, params };
  }

  async execute(): Promise<Result> {
    try {
      if ((this.action === "update" || this.action === "delete") && !this.filters.length) {
        throw new Error(`Refusing to ${this.action} without filters`);
      }
      const { text, params } = this.buildSql();
      const { rows } = await pool.query(text, params);

      if (this.countOnly) {
        const count = rows[0]?.count ?? 0;
        return { data: [{ count }], error: null, count };
      }
      if (this.mode === "single") {
        if (rows.length !== 1) {
          return {
            data: null,
            error: { message: "JSON object requested, multiple (or no) rows returned", code: "PGRST116" },
          };
        }
        return { data: rows[0], error: null };
      }
      if (this.mode === "maybeSingle") return { data: rows[0] ?? null, error: null };
      return { data: rows, error: null };
    } catch (err: any) {
      console.error(`[db] ${this.action} on ${this.table} failed:`, err?.message);
      return { data: null, error: { message: err?.message ?? "Database error", code: err?.code } };
    }
  }

  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

async function rpc(name: string, args: Record<string, any>): Promise<Result> {
  try {
    switch (name) {
      case "assign_test_to_user": {
        const { rowCount } = await pool.query(
          `UPDATE qa_tests SET assigned_to = $2, assigned_at = now(), assigned_by = $2
           WHERE id = $1 AND assigned_to IS NULL`,
          [args.test_id, args.user_id]
        );
        return { data: (rowCount ?? 0) > 0, error: null };
      }
      case "unassign_test": {
        const { rowCount } = await pool.query(
          `UPDATE qa_tests SET assigned_to = NULL, assigned_at = NULL, assigned_by = NULL
           WHERE id = $1 AND assigned_to = $2`,
          [args.test_id, args.user_id]
        );
        return { data: (rowCount ?? 0) > 0, error: null };
      }
      case "toggle_test_disabled_status": {
        const { rowCount } = await pool.query(
          `UPDATE qa_tests SET disabled = NOT disabled WHERE id = $1`,
          [args.test_id]
        );
        return { data: (rowCount ?? 0) > 0, error: null };
      }
      case "can_modify_test_progress": {
        const { rows } = await pool.query(
          `SELECT assigned_to FROM qa_tests WHERE id = $1`,
          [args.test_id]
        );
        const assigned = rows[0]?.assigned_to;
        return { data: !assigned || assigned === args.user_id, error: null };
      }
      default:
        return { data: null, error: { message: `Unknown function: ${name}` } };
    }
  } catch (err: any) {
    return { data: null, error: { message: err?.message ?? "Database error" } };
  }
}

function toAuthUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    created_at: row.createdAt,
    email_confirmed_at: row.createdAt,
    last_sign_in_at: row.lastSignInAt ?? null,
    user_metadata: { name: row.name },
  };
}

const USER_SELECT = `SELECT u.id, u.email, u.name, u."createdAt",
  (SELECT max(s."createdAt") FROM session s WHERE s."userId" = u.id) AS "lastSignInAt"
  FROM "user" u`;

const authAdmin = {
  async listUsers() {
    try {
      const { rows } = await pool.query(`${USER_SELECT} ORDER BY u.name`);
      return { data: { users: rows.map(toAuthUser) }, error: null };
    } catch (err: any) {
      return { data: { users: [] as ReturnType<typeof toAuthUser>[] }, error: { message: err.message } };
    }
  },
  async getUserById(id: string) {
    try {
      const { rows } = await pool.query(`${USER_SELECT} WHERE u.id = $1`, [id]);
      if (!rows[0]) return { data: { user: null }, error: { message: "User not found" } };
      return { data: { user: toAuthUser(rows[0]) }, error: null };
    } catch (err: any) {
      return { data: { user: null }, error: { message: err.message } };
    }
  },
};

export function createDbClient() {
  return {
    from: (table: string) => new QueryBuilder(table),
    rpc,
    auth: { admin: authAdmin },
  };
}

export const dbClient = createDbClient();
