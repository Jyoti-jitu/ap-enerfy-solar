import { db, schema, runMigrations } from "./index";
import bcrypt from "bcryptjs";
import { PERMISSIONS, ROLES } from "../lib/rbac";
import { eq } from "drizzle-orm";

export async function seedRbac() {
  console.log("Ensuring database migrations are up to date...");
  await runMigrations();

  console.log("Seeding RBAC Permissions...");
  // 1. Insert permissions
  const permMap = new Map<string, string>();
  for (const perm of PERMISSIONS) {
    try {
      const [p] = await db
        .insert(schema.permissions)
        .values({
          code: perm.code,
          name: perm.name,
          resource: perm.resource,
          action: perm.action,
          description: perm.description,
        })
        .onConflictDoNothing()
        .returning();

      if (p) {
        permMap.set(p.code, p.id);
      } else {
        const [existing] = await db
          .select()
          .from(schema.permissions)
          .where(eq(schema.permissions.code, perm.code));
        if (existing) permMap.set(existing.code, existing.id);
      }
    } catch (e) {
      console.warn(`Permission insert notice (${perm.code}):`, e);
    }
  }

  console.log("Seeding RBAC Roles...");
  // 2. Insert roles
  const roleMap = new Map<string, string>();
  for (const [slug, role] of Object.entries(ROLES)) {
    try {
      const [r] = await db
        .insert(schema.roles)
        .values({
          name: role.name,
          slug: role.slug,
          description: role.description,
          isSystem: true,
        })
        .onConflictDoNothing()
        .returning();

      if (r) {
        roleMap.set(slug, r.id);
      } else {
        const [existing] = await db
          .select()
          .from(schema.roles)
          .where(eq(schema.roles.slug, slug));
        if (existing) roleMap.set(slug, existing.id);
      }
    } catch (e) {
      console.warn(`Role insert notice (${slug}):`, e);
    }
  }

  console.log("Linking Role Permissions...");
  // 3. Link role permissions
  for (const [slug, role] of Object.entries(ROLES)) {
    const roleId = roleMap.get(slug);
    if (!roleId) continue;

    for (const permCode of role.permissions) {
      const permId = permMap.get(permCode);
      if (!permId) continue;

      try {
        await db
          .insert(schema.rolePermissions)
          .values({
            roleId,
            permissionId: permId,
          })
          .onConflictDoNothing();
      } catch (e) {
        // Ignored if already mapped
      }
    }
  }

  console.log("Seeding Users for all 7 User Roles + Edge Cases...");
  // 4. Get a branch ID
  const branches = await db.select().from(schema.branches);
  const branchId = branches[0]?.id;

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  const usersToSeed = [
    // 1. Super Admin
    {
      name: "Aditya Patnaik (Super Admin)",
      email: "admin@apenerfy.com",
      username: "admin",
      role: "super_admin",
      phone: "+91 94370 00001",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 2. Accountant
    {
      name: "Pooja Sharma (Accountant)",
      email: "accountant@apenerfy.com",
      username: "accountant",
      role: "accountant",
      phone: "+91 94370 00002",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 3. Sales Executive
    {
      name: "Vikram Mohanty (Sales)",
      email: "sales@apenerfy.com",
      username: "sales",
      role: "sales_executive",
      phone: "+91 94370 00003",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 4. Storekeeper
    {
      name: "Ramesh Nayak (Storekeeper)",
      email: "store@apenerfy.com",
      username: "store",
      role: "storekeeper",
      phone: "+91 94370 00004",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 5. Installation Engineer
    {
      name: "Saurabh Jena (Site Engineer)",
      email: "engineer@apenerfy.com",
      username: "engineer",
      role: "installation_engineer",
      phone: "+91 94370 00005",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 6. Service Technician
    {
      name: "Deepak Sethi (Service Tech)",
      email: "tech@apenerfy.com",
      username: "tech",
      role: "service_technician",
      phone: "+91 94370 00006",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // 7. Branch Manager
    {
      name: "Ananya Mishra (Branch Manager)",
      email: "manager@apenerfy.com",
      username: "manager",
      role: "branch_manager",
      phone: "+91 94370 00007",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },

    // Edge Cases for testing
    // A. Deactivated / Inactive account
    {
      name: "Rajesh Sahu (Deactivated Staff)",
      email: "deactivated@apenerfy.com",
      username: "deactivated",
      role: "sales_executive",
      phone: "+91 94370 99991",
      status: "Inactive" as const,
      mustChangePassword: false,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    // B. Temporarily Locked Account (Rate limit triggered)
    {
      name: "Karan Verma (Rate-Locked Account)",
      email: "locked@apenerfy.com",
      username: "locked",
      role: "installation_engineer",
      phone: "+91 94370 99992",
      status: "Active" as const,
      mustChangePassword: false,
      failedLoginAttempts: 5,
      lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 mins in future
    },
    // C. First-Login Password Change Required
    {
      name: "Sunil Pradhan (First-Time User)",
      email: "firstlogin@apenerfy.com",
      username: "firstlogin",
      role: "service_technician",
      phone: "+91 94370 99993",
      status: "Active" as const,
      mustChangePassword: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  ];

  for (const u of usersToSeed) {
    let userId: string | null = null;
    const [existing] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, u.email));

    if (existing) {
      userId = existing.id;
      // Update with new fields
      await db
        .update(schema.users)
        .set({
          name: u.name,
          username: u.username,
          passwordHash: defaultPasswordHash,
          role: u.role,
          status: u.status,
          isActive: u.status === "Active",
          mustChangePassword: u.mustChangePassword,
          failedLoginAttempts: u.failedLoginAttempts,
          lockedUntil: u.lockedUntil,
        })
        .where(eq(schema.users.id, existing.id));
    } else {
      const [inserted] = await db
        .insert(schema.users)
        .values({
          name: u.name,
          email: u.email,
          username: u.username,
          passwordHash: defaultPasswordHash,
          role: u.role,
          branchId,
          status: u.status,
          isActive: u.status === "Active",
          mustChangePassword: u.mustChangePassword,
          failedLoginAttempts: u.failedLoginAttempts,
          lockedUntil: u.lockedUntil,
        })
        .returning();
      if (inserted) userId = inserted.id;
    }

    // Link user to userRoles table
    const roleId = roleMap.get(u.role);
    if (userId && roleId) {
      try {
        await db
          .insert(schema.userRoles)
          .values({
            userId,
            roleId,
          })
          .onConflictDoNothing();
      } catch (e) {
        // Already exists
      }
    }
  }

  console.log("✓ RBAC permissions, roles and all 7 role user accounts seeded successfully!");
}

if (require.main === module) {
  seedRbac()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("RBAC seed error:", err);
      process.exit(1);
    });
}
