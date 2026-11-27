import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/roles - List all roles with user count and permission count
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rolesList = await db.select().from(schema.roles);

    const enrichedRoles = await Promise.all(
      rolesList.map(async (r: any) => {
        // Count users assigned
        const userCountRes = await db
          .select({ count: sql`count(*)` })
          .from(schema.userRoles)
          .where(eq(schema.userRoles.roleId, r.id));

        // Count permissions assigned
        const permCountRes = await db
          .select({ count: sql`count(*)` })
          .from(schema.rolePermissions)
          .where(eq(schema.rolePermissions.roleId, r.id));

        return {
          id: r.id,
          name: r.name,
          slug: r.slug,
          description: r.description,
          isSystem: r.isSystem,
          isSystemRole: r.isSystemRole,
          isActive: r.isActive,
          userCount: Number(userCountRes[0]?.count || 0),
          permissionCount: r.slug === "super_admin" ? "All (*)" : Number(permCountRes[0]?.count || 0),
          createdAt: r.createdAt,
        };
      })
    );

    return NextResponse.json(enrichedRoles);
  } catch (err: any) {
    console.error("Fetch roles error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch roles" }, { status: 500 });
  }
}

// POST /api/roles - Create custom role
export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(currentUser.permissions, "roles.manage")) {
    return NextResponse.json({ success: false, error: "Forbidden: Only Super Admins can manage roles" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, permissionKeys } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Role name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 32);

    // Check duplicate slug
    const [existing] = await db.select().from(schema.roles).where(eq(schema.roles.slug, slug));
    if (existing) {
      return NextResponse.json({ success: false, error: `A role with slug '${slug}' already exists` }, { status: 400 });
    }

    const [newRole] = await db
      .insert(schema.roles)
      .values({
        companyId: currentUser.companyId,
        name,
        slug,
        description: description || null,
        isSystem: false,
        isSystemRole: false,
        isActive: true,
      })
      .returning();

    // Map permissions if provided
    if (Array.isArray(permissionKeys) && permissionKeys.length > 0) {
      for (const key of permissionKeys) {
        const [perm] = await db
          .select()
          .from(schema.permissions)
          .where(eq(schema.permissions.code, key));

        if (perm) {
          await db
            .insert(schema.rolePermissions)
            .values({
              roleId: newRole.id,
              permissionId: perm.id,
            })
            .onConflictDoNothing();
        }
      }
    }

    // Audit log
    await db.insert(schema.auditLogs).values({
      userId: currentUser.id,
      action: "ROLE_CREATED",
      entity: "roles",
      entityId: newRole.id,
      newValues: JSON.stringify({ name: newRole.name, slug: newRole.slug }),
    });

    return NextResponse.json({ success: true, role: newRole });
  } catch (err: any) {
    console.error("Create role error:", err);
    return NextResponse.json({ success: false, error: "Failed to create role" }, { status: 500 });
  }
}
