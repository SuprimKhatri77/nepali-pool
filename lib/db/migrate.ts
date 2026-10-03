// Applies the given SQL migration files from supabase/migrations, in order,
// each in its own transaction (a failing file is rolled back entirely).
//
//   bun db:migrate supabase/migrations/0030_example.sql [more files...] [--yes]
//
// Migrations are applied by hand per release rather than through drizzle's
// migrator: the history can't replay from an empty database and the
// production database has no drizzle migration journal, so `migrate()` would
// try to re-run everything from 0000.
//
// DATABASE_URL comes from the environment, falling back to .env (the same
// source drizzle.config.ts uses). Set DATABASE_SSL=disable for the local
// docker database. The target host is shown and must be confirmed (or pass
// --yes); credentials are never printed.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env", quiet: true });

const MIGRATIONS_DIR = path.resolve("supabase/migrations");

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function describeTarget(url: string) {
  try {
    const { hostname, port, pathname } = new URL(url);
    return `${hostname}${port ? `:${port}` : ""}${pathname}`;
  } catch {
    fail("DATABASE_URL is not a valid connection URL.");
  }
}

async function confirm(question: string) {
  if (!process.stdin.isTTY) return false;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

async function main() {
  const args = process.argv.slice(2);
  const skipConfirm = args.includes("--yes");
  const files = args.filter((arg) => arg !== "--yes").map((f) => path.resolve(f));

  if (files.length === 0) {
    fail("Usage: bun db:migrate supabase/migrations/<file>.sql [...] [--yes]");
  }
  for (const file of files) {
    if (path.dirname(file) !== MIGRATIONS_DIR || !file.endsWith(".sql")) {
      fail(`Not a migration file in supabase/migrations: ${file}`);
    }
  }

  const url = process.env.DATABASE_URL;
  if (!url) fail("DATABASE_URL is not set (environment or .env).");

  // Read everything up front so a missing file fails before touching the DB.
  const migrations = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(file, "utf8").catch(() =>
        fail(`Cannot read ${file}`),
      );
      return {
        name: path.basename(file),
        // drizzle-kit separates statements with this marker.
        statements: content
          .split("--> statement-breakpoint")
          .map((statement) => statement.trim())
          .filter(Boolean),
      };
    }),
  );

  console.log(`Target database: ${describeTarget(url)}`);
  for (const { name } of migrations) console.log(`  - ${name}`);
  if (!skipConfirm && !(await confirm("Apply these migrations? [y/N] "))) {
    fail("Aborted, nothing was applied.");
  }

  const sql = postgres(url, {
    ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
    prepare: false,
    max: 1,
    onnotice: () => {},
  });

  try {
    for (const { name, statements } of migrations) {
      try {
        await sql.begin(async (tx) => {
          for (const statement of statements) await tx.unsafe(statement);
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        fail(`✗ ${name} failed and was rolled back: ${message}`);
      }
      console.log(`✓ ${name}`);
    }
  } finally {
    await sql.end();
  }
}

main();
