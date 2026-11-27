import { createRealtime, rawSql, pgParam } from "@neon/realtime/server";

/**
 * Neon Realtime Integration
 * Enables live reactive SQL queries directly over Lakebase Postgres.
 * Injected env vars: NEON_REALTIME_URL, NEON_REALTIME_SECRET, DATABASE_URL
 */

function getDatabaseName(): string {
  const url = process.env.DATABASE_URL;
  if (!url) return "neondb";
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\//, "") || "neondb";
  } catch {
    return "neondb";
  }
}

let realtimeServerInstance: any = null;

export function getRealtimeServer() {
  if (!process.env.NEON_REALTIME_SECRET) {
    return null;
  }

  if (!realtimeServerInstance) {
    realtimeServerInstance = createRealtime({
      secret: process.env.NEON_REALTIME_SECRET,
      db: getDatabaseName(),
    });
  }

  return realtimeServerInstance;
}

export function isNeonRealtimeConfigured(): boolean {
  return Boolean(process.env.NEON_REALTIME_URL && process.env.NEON_REALTIME_SECRET);
}

export async function sealLiveQuery(sqlQuery: string, params: any[] = []) {
  const server = getRealtimeServer();
  if (!server) {
    throw new Error("Neon Realtime secret is not configured in environment (NEON_REALTIME_SECRET).");
  }

  const query = rawSql(sqlQuery, params);
  const sealed = await server.seal({ query });
  return sealed;
}

export { rawSql, pgParam };
