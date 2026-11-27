import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";
import { db, schema } from "@/db";
import { eq, desc, and, ne } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/profile - View current user profile & recent activities
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [userRecord] = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        username: schema.users.username,
        role: schema.users.role,
        phone: schema.users.phone,
        avatar: schema.users.avatar,
        profileImage: schema.users.profileImage,
        status: schema.users.status,
        lastLoginAt: schema.users.lastLoginAt,
        lastLoginIp: schema.users.lastLoginIp,
        passwordChangedAt: schema.users.passwordChangedAt,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, currentUser.id))
      .limit(1);

    // Fetch primary branch details
    let branchName = "Bhubaneswar HQ";
    if (currentUser.branchId) {
      const [b] = await db
        .select({ name: schema.branches.name, city: schema.branches.city })
        .from(schema.branches)
        .where(eq(schema.branches.id, currentUser.branchId))
        .limit(1);
      if (b) branchName = `${b.name} (${b.city})`;
    }

    // Fetch recent login activity from audit_logs
    const recentActivity = await db
      .select({
        action: schema.auditLogs.action,
        ipAddress: schema.auditLogs.ipAddress,
        createdAt: schema.auditLogs.createdAt,
      })
      .from(schema.auditLogs)
      .where(eq(schema.auditLogs.userId, currentUser.id))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(10);

    return NextResponse.json({
      profile: {
        ...userRecord,
        branchName,
        roles: currentUser.roles,
        permissions: currentUser.permissions,
      },
      recentActivity,
    });
  } catch (err: any) {
    console.error("Profile API error:", err);
    return NextResponse.json({ success: false, error: "Failed to load profile" }, { status: 500 });
  }
}

// PATCH /api/profile - Update authorized personal info (name, phone, avatar)
export async function PATCH(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, avatar } = body;

    // Disallow privilege escalation: Role, Company, Branch, Status, Permissions are strictly protected
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (typeof name === "string" && name.trim().length > 1) updateData.name = name.trim();
    if (typeof phone === "string") updateData.phone = phone.trim();
    if (typeof avatar === "string") {
      updateData.avatar = avatar;
      updateData.profileImage = avatar;
    }

    await db.update(schema.users).set(updateData).where(eq(schema.users.id, currentUser.id));

    // Record audit log
    await db.insert(schema.auditLogs).values({
      userId: currentUser.id,
      action: "PROFILE_UPDATED",
      entity: "users",
      entityId: currentUser.id,
      newValues: JSON.stringify({ name, phone }),
    });

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
