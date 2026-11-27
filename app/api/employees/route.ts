import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import { AuthService } from "@/services/auth.service";
import { enforceApiPermission, getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export const dynamic = "force-dynamic";

// GET /api/employees - View employee directory with role & security status
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in." },
      { status: 401 }
    );
  }
  if (!hasPermission(currentUser.permissions, "employees:view")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: You do not have permission to view employees." },
      { status: 403 }
    );
  }

  try {
    const userList = await db.query.users.findMany({
      with: {
        branch: true,
      },
      orderBy: [desc(schema.users.createdAt)],
    });

    // Return sanitized employee records
    const sanitized = userList.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.username,
      role: u.role,
      phone: u.phone,
      status: u.status,
      isActive: u.isActive,
      mustChangePassword: u.mustChangePassword,
      failedLoginAttempts: u.failedLoginAttempts,
      lockedUntil: u.lockedUntil,
      lastLoginAt: u.lastLoginAt,
      lastLoginIp: u.lastLoginIp,
      branch: u.branch ? { id: u.branch.id, name: u.branch.name, city: u.branch.city } : null,
      createdAt: u.createdAt,
    }));

    return NextResponse.json(sanitized);
  } catch (error: any) {
    console.error("Fetch employees error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch employees" }, { status: 500 });
  }
}

// POST /api/employees - Super Admin creates employee account
export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in." },
      { status: 401 }
    );
  }
  if (!hasPermission(currentUser.permissions, "employees:create")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Only Super Admins can create new employees." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, username, phone, roleSlug, branchId, passwordPlain, mustChangePassword } = body;

    if (!name || !email || !roleSlug) {
      return NextResponse.json(
        { success: false, error: "Name, email and role are required." },
        { status: 400 }
      );
    }

    const result = await AuthService.createEmployee(
      {
        name,
        email,
        username,
        phone,
        roleSlug,
        branchId,
        passwordPlain,
        mustChangePassword: mustChangePassword ?? true,
      },
      currentUser?.id
    );

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Create employee error:", error);
    return NextResponse.json({ success: false, error: "Failed to create employee" }, { status: 500 });
  }
}
