import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, schema } from "@/db";
import { eq, and, gt } from "drizzle-orm";
import { AuthService } from "@/services/auth.service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("ap_solar_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const [sessionRecord] = await db
      .select()
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.sessionToken, sessionToken),
          eq(schema.sessions.isValid, true),
          gt(schema.sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!sessionRecord) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, sessionRecord.userId))
      .limit(1);

    if (!user || user.status !== "Active" || !user.isActive) {
      return NextResponse.json({ authenticated: false, error: "Account deactivated" }, { status: 403 });
    }

    const { roles, permissions } = await AuthService.getUserPermissions(user.id, user.role);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        roles,
        permissions,
        branchId: user.branchId,
        mustChangePassword: !!user.mustChangePassword,
      },
    });
  } catch (error: any) {
    console.error("Session lookup error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
