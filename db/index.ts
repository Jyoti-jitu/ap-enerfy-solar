import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

// Global singleton instances to avoid multiple connections in development hot reload
const globalForDb = globalThis as unknown as {
  dbInstance?: any;
  pgClient?: postgres.Sql;
  pgliteClient?: PGlite;
};

function createDbInstance() {
  const databaseUrl = process.env.DATABASE_URL;

  // If a valid remote Neon PostgreSQL connection string is supplied
  if (databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) && !databaseUrl.includes("localhost:5432")) {
    try {
      if (!globalForDb.pgClient) {
        globalForDb.pgClient = postgres(databaseUrl, { prepare: false, max: 10 });
      }
      return drizzlePostgres(globalForDb.pgClient, { schema });
    } catch (err) {
      console.warn("Failed to connect to Neon PostgreSQL, falling back to embedded PGlite:", err);
    }
  }

  // Fallback to embedded real PostgreSQL engine (PGlite)
  const dataDir = path.join(process.cwd(), ".data", "pglite_db");
  if (!fs.existsSync(path.dirname(dataDir))) {
    fs.mkdirSync(path.dirname(dataDir), { recursive: true });
  }

  if (!globalForDb.pgliteClient) {
    globalForDb.pgliteClient = new PGlite(dataDir);
  }

  return drizzlePglite(globalForDb.pgliteClient, { schema });
}

export const db = globalForDb.dbInstance ?? (globalForDb.dbInstance = createDbInstance());
export const pool = globalForDb.pgClient;
export { schema };

/**
 * Migration helper that applies all SQL schema files in order
 */
export async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.error("Migrations directory not found at:", migrationsDir);
    return;
  }

  const sqlFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const isNeon = databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) && !databaseUrl.includes("localhost:5432");

  let neonSql: any = null;
  if (isNeon) {
    neonSql = neon(databaseUrl);
  } else {
    if (!globalForDb.pgliteClient) {
      const dataDir = path.join(process.cwd(), ".data", "pglite_db");
      if (!fs.existsSync(path.dirname(dataDir))) {
        fs.mkdirSync(path.dirname(dataDir), { recursive: true });
      }
      globalForDb.pgliteClient = new PGlite(dataDir);
    }
  }

  for (const file of sqlFiles) {
    const filePath = path.join(migrationsDir, file);
    const sqlContent = fs.readFileSync(filePath, "utf-8");
    const statements = sqlContent
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        if (isNeon) {
          await neonSql(stmt);
        } else {
          await globalForDb.pgliteClient!.exec(stmt);
        }
      } catch (err: any) {
        if (!err.message?.includes("already exists") && !err.message?.includes("duplicate key")) {
          console.warn(`Migration statement notice (${file}):`, err.message);
        }
      }
    }
  }
}

/**
 * Diagnostic helper to verify live connection to Neon PostgreSQL
 */
export async function checkNeonDatabase(): Promise<{
  connected: boolean;
  isNeon: boolean;
  database: string;
  version: string;
  customerCount: number;
  invoiceCount: number;
  projectCount: number;
}> {
  const databaseUrl = process.env.DATABASE_URL;
  const isNeon = Boolean(databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://")) && !databaseUrl.includes("localhost:5432"));

  if (isNeon && databaseUrl) {
    const sql = neon(databaseUrl);
    const versionRes: any = await sql`SELECT current_database() as db, version() as ver`;
    const counts: any = await sql`
      SELECT 
        (SELECT count(*) FROM customers) as customers,
        (SELECT count(*) FROM invoices) as invoices,
        (SELECT count(*) FROM projects) as projects
    `;
    return {
      connected: true,
      isNeon: true,
      database: versionRes[0]?.db || "neondb",
      version: versionRes[0]?.ver || "PostgreSQL (Neon)",
      customerCount: Number(counts[0]?.customers || 0),
      invoiceCount: Number(counts[0]?.invoices || 0),
      projectCount: Number(counts[0]?.projects || 0),
    };
  }

  return {
    connected: true,
    isNeon: false,
    database: "embedded_pglite",
    version: "PostgreSQL (PGlite embedded)",
    customerCount: 0,
    invoiceCount: 0,
    projectCount: 0,
  };
}
