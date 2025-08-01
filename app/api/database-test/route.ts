import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    connection: false,
    tables: {
      user_profiles: { exists: false, count: 0 },
      qa_tests: { exists: false, count: 0 },
      qa_user_test_progress: { exists: false, count: 0 },
    },
    errors: [] as string[],
    responseTime: 0,
  };

  try {
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("user_profiles")
      .select("count", { count: "exact", head: true });

    if (connectionError) {
      results.errors.push(`Connection failed: ${connectionError.message}`);
    } else {
      results.connection = true;
    }

    // Test each table
    const tables = ["user_profiles", "qa_tests", "qa_user_test_progress"] as const;

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count", { count: "exact", head: true });

        if (error) {
          results.errors.push(`Table ${table} error: ${error.message}`);
          results.tables[table] = { exists: false, count: 0 };
        } else {
          results.tables[table] = {
            exists: true,
            count: data?.[0]?.count || 0,
          };
        }
      } catch (err) {
        results.errors.push(
          `Table ${table} failed: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        results.tables[table] = { exists: false, count: 0 };
      }
    }

          // Test sample data fetch
      try {
        const { data: users, error: usersError } = await supabase
          .from("user_profiles")
          .select("*")
          .limit(5);

      if (usersError) {
        results.errors.push(`Sample data fetch failed: ${usersError.message}`);
      }
    } catch (err) {
      results.errors.push(
        `Sample data fetch error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  } catch (err) {
    results.errors.push(
      `General error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }

  results.responseTime = Date.now() - startTime;

  return NextResponse.json(results);
}
