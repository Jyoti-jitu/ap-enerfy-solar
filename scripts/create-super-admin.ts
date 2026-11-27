try {
  process.loadEnvFile?.(".env");
} catch {}

import { db, schema } from "../db/index";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Super Admin Provisioning Validation Schema
 * Enforces enterprise security standards
 */
const SuperAdminSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Valid corporate email is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username may only contain letters, numbers, dots, and hyphens"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one numeric digit")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
});

export async function createSuperAdmin() {
  console.log("=================================================================");
  console.log("AP ENERFY SOLAR - SUPER ADMIN ACCOUNT PROVISIONING");
  console.log("=================================================================");

  // Read environment variables
  const rawCredentials = {
    name: process.env.SUPER_ADMIN_NAME || "Super Admin",
    email: process.env.SUPER_ADMIN_EMAIL || "admin@apenerfy.com",
    username: process.env.SUPER_ADMIN_USERNAME || "superadmin",
    password: process.env.SUPER_ADMIN_PASSWORD || "Admin@Solar2025!",
  };

  // 1. Validate inputs with Zod
  const validationResult = SuperAdminSchema.safeParse(rawCredentials);
  if (!validationResult.success) {
    console.error("❌ Invalid Super Admin bootstrap credentials:");
    validationResult.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join(".")}: ${err.message}`);
    });
    // Wipe sensitive password from memory
    delete process.env.SUPER_ADMIN_PASSWORD;
    process.exit(1);
  }

  const { name, email, username, password } = validationResult.data;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  try {
    // 2. Fetch default company & headquarters branch
    let [company] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.code, "APES"))
      .limit(1);

    if (!company) {
      const [newCo] = await db
        .insert(schema.companies)
        .values({
          name: "AP Enerfy Solar Pvt Ltd",
          code: "APES",
          state: "Odisha",
          currency: "INR",
        })
        .returning();
      company = newCo;
    }

    let [branch] = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.code, "BBSR"))
      .limit(1);

    // 3. Ensure Super Admin role exists
    let [superAdminRole] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.slug, "super_admin"))
      .limit(1);

    if (!superAdminRole) {
      const [newRole] = await db
        .insert(schema.roles)
        .values({
          companyId: company.id,
          name: "Super Admin",
          slug: "super_admin",
          description: "Complete enterprise root administrator with unrestricted access",
          isSystem: true,
          isSystemRole: true,
          isActive: true,
        })
        .returning();
      superAdminRole = newRole;
    }

    // 4. Check for existing administrator (Idempotency check)
    const existingUsers = await db
      .select()
      .from(schema.users)
      .where(
        or(
          eq(schema.users.normalizedEmail, normalizedEmail),
          eq(schema.users.email, normalizedEmail),
          eq(schema.users.normalizedUsername, normalizedUsername),
          eq(schema.users.username, normalizedUsername)
        )
      )
      .limit(1);

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      console.log(`ℹ️ Super Admin account already exists: [${existingUser.email}] (ID: ${existingUser.id})`);
      console.log("  Security Policy: Existing administrator password will NEVER be overwritten automatically.");

      // Ensure user has super_admin role linked
      await db
        .insert(schema.userRoles)
        .values({
          userId: existingUser.id,
          roleId: superAdminRole.id,
        })
        .onConflictDoNothing();

      if (branch) {
        await db
          .insert(schema.userBranches)
          .values({
            userId: existingUser.id,
            branchId: branch.id,
            isPrimary: true,
          })
          .onConflictDoNothing();
      }

      console.log("✓ Super Admin role and branch scoping verified.");
      console.log("=================================================================\n");
      return existingUser;
    }

    // 5. Hash password before persisting
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Insert new Super Admin
    const [createdAdmin] = await db
      .insert(schema.users)
      .values({
        companyId: company.id,
        branchId: branch ? branch.id : null,
        name,
        email: normalizedEmail,
        normalizedEmail,
        username: normalizedUsername,
        normalizedUsername,
        passwordHash,
        role: "super_admin",
        isActive: true,
        status: "Active",
        mustChangePassword: false,
        sessionVersion: 1,
      })
      .returning();

    // 7. Map Super Admin role and branch
    await db
      .insert(schema.userRoles)
      .values({
        userId: createdAdmin.id,
        roleId: superAdminRole.id,
      })
      .onConflictDoNothing();

    if (branch) {
      await db
        .insert(schema.userBranches)
        .values({
          userId: createdAdmin.id,
          branchId: branch.id,
          isPrimary: true,
        })
        .onConflictDoNothing();
    }

    // 8. Record audit trail
    await db.insert(schema.auditLogs).values({
      userId: createdAdmin.id,
      companyId: company.id,
      action: "SUPER_ADMIN_INITIALIZED",
      entity: "users",
      entityId: createdAdmin.id,
      newValues: JSON.stringify({
        email: createdAdmin.email,
        username: createdAdmin.username,
        role: createdAdmin.role,
      }),
    });

    console.log("✅ Super Admin account created successfully!");
    console.log(`   Name:      ${createdAdmin.name}`);
    console.log(`   Email:     ${createdAdmin.email}`);
    console.log(`   Username:  ${createdAdmin.username}`);
    console.log(`   Role:      Super Admin (${createdAdmin.role})`);
    console.log(`   Company:   ${company.name} (${company.code})`);
    console.log(`   Branch:    ${branch?.name || "Bhubaneswar HQ"}`);
    console.log("   Password:  [SECURE HASH STORED - NEVER EXPOSED IN TERMINAL]");
    console.log("=================================================================\n");

    return createdAdmin;
  } finally {
    // 9. Remove temporary bootstrap password from environment memory
    delete process.env.SUPER_ADMIN_PASSWORD;
  }
}

if (require.main === module || process.argv[1]?.endsWith("create-super-admin.ts")) {
  createSuperAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Super Admin creation failed:", err);
      process.exit(1);
    });
}
