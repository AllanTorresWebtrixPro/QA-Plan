// Seeds the Neon database with QA test cases.
// 1. json/qa_tests_rows.json (export of the original Supabase qa_tests table)
// 2. Every repo SQL script that inserts into qa_tests / test_cases
// Run: node --env-file-if-exists=/vercel/share/.env.project scripts/seed-neon.mjs
import fs from "node:fs"
import path from "node:path"
import pg from "pg"

const connectionString =
  process.env.NEON_DATABASE_URL_UNPOOLED || process.env.NEON_DATABASE_URL || process.env.DATABASE_URL
if (!connectionString) throw new Error("NEON_DATABASE_URL is not set")

const pool = new pg.Pool({ connectionString: connectionString.replace("sslmode=require", "sslmode=verify-full") })
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..")

function splitStatements(sql) {
  const out = []
  let cur = ""
  let inStr = false
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i]
    if (!inStr && ch === "-" && sql[i + 1] === "-") {
      while (i < sql.length && sql[i] !== "\n") i++
      cur += "\n"
      continue
    }
    if (ch === "'") {
      if (inStr && sql[i + 1] === "'") {
        cur += "''"
        i++
        continue
      }
      inStr = !inStr
    }
    if (ch === ";" && !inStr) {
      if (cur.trim()) out.push(cur.trim())
      cur = ""
      continue
    }
    cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

const parseJson = (v) => {
  if (v == null) return []
  if (typeof v !== "string") return v
  try {
    return JSON.parse(v)
  } catch {
    return [v]
  }
}

async function main() {
  const client = await pool.connect()
  try {
    const rows = JSON.parse(fs.readFileSync(path.join(root, "json/qa_tests_rows.json"), "utf8"))
    for (const r of rows) {
      await client.query(
        `INSERT INTO qa_tests (id, title, category, subcategory, priority, steps, expected, edge_cases, disabled, notes, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8::jsonb,$9,$10,COALESCE($11::timestamptz, now()),COALESCE($12::timestamptz, now()))
         ON CONFLICT (id) DO NOTHING`,
        [
          r.id,
          r.title,
          r.category,
          r.subcategory || null,
          r.priority,
          JSON.stringify(parseJson(r.steps)),
          r.expected || "",
          JSON.stringify(parseJson(r.edge_cases)),
          r.disabled === true || r.disabled === "true",
          r.notes || null,
          r.created_at || null,
          r.updated_at || null,
        ],
      )
    }
    console.log(`JSON export: processed ${rows.length} rows`)

    await client.query("BEGIN")
    await client.query(
      `CREATE TEMP TABLE test_cases (title text, category text, subcategory text, priority text, steps text, expected text, edge_cases text, created_at timestamptz, updated_at timestamptz)`,
    )

    const files = fs.readdirSync(path.join(root, "scripts")).filter((f) => f.endsWith(".sql"))
    for (const file of files) {
      const sql = fs.readFileSync(path.join(root, "scripts", file), "utf8")
      const inserts = splitStatements(sql).filter((s) => /^INSERT INTO (qa_tests|test_cases)\b/i.test(s))
      let ok = 0
      for (let stmt of inserts) {
        if (/^INSERT INTO qa_tests/i.test(stmt)) {
          stmt = stmt.replace(/ON CONFLICT[\s\S]*$/i, "")
          stmt += " ON CONFLICT (id) DO NOTHING"
        }
        await client.query("SAVEPOINT s")
        try {
          await client.query(stmt)
          ok++
          await client.query("RELEASE SAVEPOINT s")
        } catch (e) {
          await client.query("ROLLBACK TO SAVEPOINT s")
          console.warn(`  ${file}: skipped statement (${e.message})`)
        }
      }
      if (inserts.length) console.log(`${file}: ${ok}/${inserts.length} insert statements applied`)
    }

    const moved = await client.query(`
      INSERT INTO qa_tests (id, title, category, subcategory, priority, steps, expected, edge_cases)
      SELECT DISTINCT ON (id) id, title, category, subcategory, priority, steps, expected, edge_cases FROM (
        SELECT
          lower(COALESCE(substring(title from '^([A-Za-z0-9-]+):'), 'set-' || substr(md5(title), 1, 10))) AS id,
          title, category, subcategory,
          CASE WHEN priority IN ('High','Medium','Low') THEN priority ELSE 'Medium' END AS priority,
          COALESCE(steps, '[]')::jsonb AS steps,
          COALESCE(expected, '') AS expected,
          COALESCE(edge_cases, '[]')::jsonb AS edge_cases
        FROM test_cases
      ) t
      ON CONFLICT (id) DO NOTHING`)
    console.log(`Settings test_cases: inserted ${moved.rowCount} rows`)
    await client.query("COMMIT")

    const { rows: counts } = await client.query(
      "SELECT category, count(*)::int AS n FROM qa_tests GROUP BY category ORDER BY category",
    )
    console.table(counts)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
