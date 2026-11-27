import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";
import { getCurrentUser, protectLastSuperAdmin, revokeUserSessions } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";
import { AuthService } from "@/services/auth.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/employees/[id] - Fetch single employee
export async function GET(req: Request, { params }: RouteParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [user] = await db.query.users.findMany({
      where: eq(schema.users.id, id),
      with: {
        branch: true,
      },
      limit: 1,
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    const [empProfile] = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.userId, id))
      .limit(1);

    return NextResponse.json({
      success: true,
      employee: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isActive: user.isActive,
        branchId: user.branchId,
        branch: user.branch ? { id: user.branch.id, name: user.branch.name, city: user.branch.city } : null,
        department: empProfile?.department || "Engineering",
        designation: empProfile?.designation || "Staff",
        employeeCode: empProfile?.employeeCode || `EMP-${user.id.slice(0, 4).toUpperCase()}`,
        joiningDate: empProfile?.joiningDate || user.createdAt,
        salary: empProfile?.salary || null,
        lastLoginAt: user.lastLoginAt,
        lastLoginIp: user.lastLoginIp,
        failedLoginAttempts: user.failedLoginAttempts || 0,
        lockedUntil: user.lockedUntil,
      },
    });
  } catch (error: any) {
    console.error("Get employee error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch employee" }, { status: 500 });
  }
}

// PUT /api/employees/[id] - Update employee details, role, branch or status
export async function PUT(req: Request, { params }: RouteParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Super Admin check
  if (currentUser.role !== "super_admin" && !hasPermission(currentUser.permissions, "employees.update")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only Super Admins can modify employee details." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, email, phone, role, branchId, status, department, designation, employeeCode } = body;

    const [targetUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    // Role protection if demoting last super admin
    if (role && targetUser.role === "super_admin" && role !== "super_admin") {
      const protection = await protectLastSuperAdmin(id, "demote");
      if (!protection.allowed) {
        return NextResponse.json({ success: false, error: protection.reason }, { status: 400 });
      }
    }

    // Status protection if deactivating last super admin
    if (status && status !== "Active" && targetUser.role === "super_admin") {
      const protection = await protectLastSuperAdmin(id, "deactivate");
      if (!protection.allowed) {
        return NextResponse.json({ success: false, error: protection.reason }, { status: 400 });
      }
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : targetUser.normalizedEmail;

    // 1. Update user table
    const [updatedUser] = await db
      .update(schema.users)
      .set({
        name: name || targetUser.name,
        email: normalizedEmail,
        normalizedEmail,
        phone: phone !== undefined ? phone : targetUser.phone,
        role: role || targetUser.role,
        branchId: branchId !== undefined ? branchId : targetUser.branchId,
        status: status || targetUser.status,
        isActive: status ? status === "Active" : targetUser.isActive,
        sessionVersion: role && role !== targetUser.role ? sql`"session_version" + 1` : targetUser.sessionVersion,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning();

    // 2. Update role mapping if role changed
    if (role && role !== targetUser.role) {
      await AuthService.changeUserRole(id, role, currentUser.id);
    }

    // 3. Update employee table profile if exists or insert
    const [existingEmp] = await db
      .select()
      .from(schema.employees)
      .where(eq(schema.employees.userId, id))
      .limit(1);

    if (existingEmp) {
      await db
        .update(schema.employees)
        .set({
          name: name || existingEmp.name,
          email: normalizedEmail,
          phone: phone || existingEmp.phone,
          department: department || existingEmp.department,
          designation: designation || existingEmp.designation,
          branchId: branchId || existingEmp.branchId,
          status: status || existingEmp.status,
          updatedAt: new Date(),
        })
        .where(eq(schema.employees.id, existingEmp.id));
    } else if (department || designation || employeeCode) {
      await db.insert(schema.employees).values({
        userId: id,
        employeeCode: employeeCode || `EMP-${Date.now().toString().slice(-4)}`,
        name: name || targetUser.name,
        email: normalizedEmail,
        phone: phone || targetUser.phone || "N/A",
        department: department || "Engineering",
        designation: designation || "Staff",
        branchId: branchId || targetUser.branchId || null,
        joiningDate: new Date(),
        status: status || "Active",
      });
    }

    // Record audit log
    await AuthService.recordAuditLog(
      currentUser.id,
      "UPDATE_EMPLOYEE",
      "users",
      id,
      JSON.stringify({ role: updatedUser.role, status: updatedUser.status, name: updatedUser.name })
    );

    return NextResponse.json({
      success: true,
      message: "Employee updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update employee error:", error);
    return NextResponse.json({ success: false, error: "Failed to update employee" }, { status: 500 });
  }
}

// DELETE /api/employees/[id] - Delete or archive employee (Super Admin only)
export async function DELETE(req: Request, { params }: RouteParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Super Admin check
  if (currentUser.role !== "super_admin" && !hasPermission(currentUser.permissions, "employees.admin")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only Super Admins can delete employee accounts." },
      { status: 403 }
    );
  }

  const { id } = await params;

  try {
    const [targetUser] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    // Protection check: Cannot delete the last active Super Admin
    if (targetUser.role === "super_admin") {
      const protection = await protectLastSuperAdmin(id, "delete");
      if (!protection.allowed) {
        return NextResponse.json({ success: false, error: protection.reason }, { status: 400 });
      }
    }

    // Revoke all active sessions immediately
    await revokeUserSessions(id);

    // Try hard delete; if foreign key constraint blocks it, perform clean termination
    try {
      // Clean dependent auth tables
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
      await db.delete(schema.userRoles).where(eq(schema.userRoles.userId, id));
      await db.delete(schema.userBranches).where(eq(schema.userBranches.userId, id));
      await db.delete(schema.passwordResetTokens).where(eq(schema.passwordResetTokens.userId, id));
      await db.delete(schema.notifications).where(eq(schema.notifications.userId, id));
      await db.delete(schema.employees).where(eq(schema.employees.userId, id));
      await db.delete(schema.users).where(eq(schema.users.id, id));

      await AuthService.recordAuditLog(
        currentUser.id,
        "DELETE_EMPLOYEE",
        "users",
        id,
        JSON.stringify({ email: targetUser.email, name: targetUser.name })
      );

      return NextResponse.json({
        success: true,
        message: `Employee ${targetUser.name} has been permanently deleted.`,
      });
    } catch (dbErr: any) {
      console.warn("Foreign key reference prevented hard delete, terminating account instead:", dbErr);

      // Safe termination: disable login, mark terminated
      await db
        .update(schema.users)
        .set({
          status: "Terminated",
          isActive: false,
          sessionVersion: sql`"session_version" + 1`,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, id));

      await db
        .update(schema.employees)
        .set({
          status: "Terminated",
          updatedAt: new Date(),
        })
        .where(eq(schema.employees.userId, id));

      await AuthService.recordAuditLog(
        currentUser.id,
        "TERMINATE_EMPLOYEE",
        "users",
        id,
        JSON.stringify({ email: targetUser.email, status: "Terminated" })
      );

      return NextResponse.json({
        success: true,
        message: `Employee ${targetUser.name} has been deactivated and archived (historical project references preserved).`,
      });
    }
  } catch (error: any) {
    console.error("Delete employee error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete employee" }, { status: 500 });
  }
}
