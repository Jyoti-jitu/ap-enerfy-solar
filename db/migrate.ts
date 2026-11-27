try {
  process.loadEnvFile?.(".env");
} catch {}

import { runMigrations } from "./index";

async function main() {
  console.log("Running AP Enerfy Solar database migrations...");
  try {
    await runMigrations();
    console.log("✓ Database migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
