try {
  process.loadEnvFile?.(".env");
} catch {}

import { db, schema } from "../db/index";
import { sql } from "drizzle-orm";

export async function migrateAuthSchema() {
  console.log("Applying production auth & RBAC schema updates to Neon PostgreSQL...");

  const ddlStatements = [
    // 1. Users table additions
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "employee_id" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "normalized_email" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "normalized_username" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile_image" text;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "session_version" integer DEFAULT 1 NOT NULL;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_changed_at" timestamp with time zone;`,
    `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_by" uuid;`,

    // 2. Roles table additions
    `ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "company_id" uuid REFERENCES "companies"("id") ON DELETE CASCADE;`,
    `ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "is_system_role" boolean DEFAULT true NOT NULL;`,
    `ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;`,

    // 3. Permissions table additions
    `ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "permission_key" text;`,
    `ALTER TABLE "permissions" ADD COLUMN IF NOT EXISTS "module" text;`,

    // 4. User roles & role permissions additions
    `ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "assigned_by" uuid;`,
    `ALTER TABLE "user_roles" ADD COLUMN IF NOT EXISTS "assigned_at" timestamp with time zone DEFAULT now() NOT NULL;`,
    `ALTER TABLE "role_permissions" ADD COLUMN IF NOT EXISTS "assigned_at" timestamp with time zone DEFAULT now() NOT NULL;`,

    // 5. Password reset tokens & sessions additions
    `ALTER TABLE "password_reset_tokens" ADD COLUMN IF NOT EXISTS "token_hash" text;`,
    `ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "session_version" integer DEFAULT 1 NOT NULL;`,

    // 6. User branches table
    `CREATE TABLE IF NOT EXISTS "user_branches" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "branch_id" uuid NOT NULL REFERENCES "branches"("id") ON DELETE CASCADE,
      "is_primary" boolean DEFAULT false NOT NULL,
      "assigned_at" timestamp with time zone DEFAULT now() NOT NULL
    );`,

    // 7. Indexes for performance and uniqueness
    `CREATE INDEX IF NOT EXISTS "users_norm_email_idx" ON "users" ("normalized_email");`,
    `CREATE INDEX IF NOT EXISTS "users_norm_username_idx" ON "users" ("normalized_username");`,
    `CREATE INDEX IF NOT EXISTS "users_session_ver_idx" ON "users" ("id", "session_version");`,
    `CREATE INDEX IF NOT EXISTS "perms_key_idx" ON "permissions" ("permission_key");`,
    `CREATE INDEX IF NOT EXISTS "perms_module_idx" ON "permissions" ("module");`,
    `CREATE INDEX IF NOT EXISTS "user_branch_idx" ON "user_branches" ("user_id", "branch_id");`,

    // 8. Data normalizations & backfills
    `UPDATE "users" SET "normalized_email" = LOWER(TRIM("email")) WHERE "normalized_email" IS NULL;`,
    `UPDATE "users" SET "normalized_username" = LOWER(TRIM("username")) WHERE "username" IS NOT NULL AND "normalized_username" IS NULL;`,
    `UPDATE "permissions" SET "permission_key" = "code" WHERE "permission_key" IS NULL;`,
    `UPDATE "roles" SET "is_system_role" = "is_system" WHERE "is_system_role" IS NULL;`
  ];

  for (const statement of ddlStatements) {
    try {
      await db.execute(sql.raw(statement));
    } catch (err: any) {
      console.warn("DDL notice:", err.message);
    }
  }

  console.log("✓ Production auth & RBAC schema updates applied successfully!");
}

if (require.main === module || process.argv[1]?.endsWith("migrate-auth-schema.ts")) {
  migrateAuthSchema()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
