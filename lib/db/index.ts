import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(connectionString, {
  prepare: false,
  // Local docker Postgres has no SSL; set DATABASE_SSL=disable for it.
  ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
});

export const db = drizzle(client, { schema });
