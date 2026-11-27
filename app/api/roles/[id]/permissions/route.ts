import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/roles/[id]/permissions - Get all system permissions and mark which are assigned to this role
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [role] = await db.select().from(schema.roles).where(eq(schema.roles.id, id));
    if (!role) {
      return NextResponse.json({ success: false, error: "Role not found" }, { status: 404 });
    }

    // Fetch assigned permissions from role_permissions
    const rolePerms = await db
      .select({
        code: schema.permissions.code,
        permissionKey: schema.permissions.permissionKey,
      })
      .from(schema.rolePermissions)
      .innerJoin(schema.permissions, eq(schema.rolePermissions.permissionId, schema.permissions.id))
      .where(eq(schema.rolePermissions.roleId, role.id));

    const assignedCodes = new Set(rolePerms.map((p: any) => p.code));

    // Return system permissions catalog grouped by module
    const grouped: Record<string, any[]> = {};
    for (const perm of PERMISSIONS) {
      if (!grouped[perm.module]) grouped[perm.module] = [];
      grouped[perm.module].push({
        code: perm.code,
        name: perm.name,
        resource: perm.resource,
        action: perm.action,
        description: perm.description,
        assigned: role.slug === "super_admin" ? true : assignedCodes.has(perm.code),
      });
    }

    return NextResponse.json({
      role: {
        id: role.id,
        name: role.name,
        slug: role.slug,
        isSystem: role.isSystem,
        description: role.description,
      },
      modules: grouped,
      totalAssigned: role.slug === "super_admin" ? PERMISSIONS.length : assignedCodes.size,
    });
  } catch (err: any) {
    console.error("Fetch role permissions error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch role permissions" }, { status: 500 });
  }
}

// PUT /api/roles/[id]/permissions - Update permission matrix for a role
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(currentUser.permissions, "permissions.manage") && !hasPermission(currentUser.permissions, "roles.manage")) {
    return NextResponse.json({ success: false, error: "Forbidden: Super Admin access required" }, { status: 403 });
  }

  try {
    const [role] = await db.select().from(schema.roles).where(eq(schema.roles.id, id));
    if (!role) {
      return NextResponse.json({ success: false, error: "Role not found" }, { status: 404 });
    }

    // Protect Super Admin system role from stripping permissions
    if (role.slug === "super_admin") {
      return NextResponse.json(
        { success: false, error: "Cannot modify permissions of root Super Admin system role." },
        { status: 400 }
      );
    }

    const { permissionCodes } = await req.json();
    if (!Array.isArray(permissionCodes)) {
      return NextResponse.json({ success: false, error: "permissionCodes must be an array" }, { status: 400 });
    }

    // Clear existing permissions for this role
    await db.delete(schema.rolePermissions).where(eq(schema.rolePermissions.roleId, role.id));

    // Insert new mappings
    let addedCount = 0;
    for (const code of permissionCodes) {
      const [perm] = await db.select().from(schema.permissions).where(eq(schema.permissions.code, code));
      if (perm) {
        await db.insert(schema.rolePermissions).values({
          roleId: role.id,
          permissionId: perm.id,
        });
        addedCount++;
      }
    }

    // Invalidate sessions for all users holding this role so changes take effect immediately!
    const usersWithRole = await db
      .select({ userId: schema.userRoles.userId })
      .from(schema.userRoles)
      .where(eq(schema.userRoles.roleId, role.id));

    for (const u of usersWithRole) {
      await db
        .update(schema.users)
        .set({ sessionVersion: sql`"session_version" + 1`, updatedAt: new Date() })
        .where(eq(schema.users.id, u.userId));
    }

    // Record audit log
    await db.insert(schema.auditLogs).values({
      userId: currentUser.id,
      action: "ROLE_PERMISSIONS_UPDATED",
      entity: "roles",
      entityId: role.id,
      newValues: JSON.stringify({ role: role.slug, updatedCount: addedCount }),
    });

    return NextResponse.json({
      success: true,
      message: `Updated ${addedCount} permissions for role '${role.name}'. User sessions refreshed.`,
    });
  } catch (err: any) {
    console.error("Update role permissions error:", err);
    return NextResponse.json({ success: false, error: "Failed to update permissions" }, { status: 500 });
  }
}
