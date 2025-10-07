import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local");
}

// Create Postgres client
const client = postgres(process.env.DATABASE_URL!, {
  ssl: "require", // important for Supabase
  prepare: false, // optional
});

const db = drizzle(client);

async function runMigration() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migration done successfully!");
  } catch (error) {
    console.error("Error migrating: ", error);
    process.exit(1);
  }
}

runMigration();
