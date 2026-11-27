import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-guard";
import { db, schema } from "@/db";
import { eq, and, gt, desc, ne } from "drizzle-orm";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/profile/sessions - List active sessions for the current user
export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const currentToken = cookieStore.get("ap_solar_session")?.value;

  try {
    const activeSessions = await db
      .select({
        id: schema.sessions.id,
        sessionToken: schema.sessions.sessionToken,
        ipAddress: schema.sessions.ipAddress,
        userAgent: schema.sessions.userAgent,
        createdAt: schema.sessions.createdAt,
        expiresAt: schema.sessions.expiresAt,
      })
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.userId, currentUser.id),
          eq(schema.sessions.isValid, true),
          gt(schema.sessions.expiresAt, new Date())
        )
      )
      .orderBy(desc(schema.sessions.createdAt));

    const sanitized = activeSessions.map((s: any) => ({
      id: s.id,
      ipAddress: s.ipAddress || "Unknown IP",
      userAgent: s.userAgent || "Web Browser",
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: Boolean(currentToken && s.sessionToken === currentToken),
    }));

    return NextResponse.json(sanitized);
  } catch (err: any) {
    console.error("Fetch sessions error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch sessions" }, { status: 500 });
  }
}

// DELETE /api/profile/sessions - Revoke other sessions (except the current session)
export async function DELETE() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const currentToken = cookieStore.get("ap_solar_session")?.value;

  try {
    if (currentToken) {
      // Invalidate all sessions except the current one
      await db
        .update(schema.sessions)
        .set({ isValid: false })
        .where(
          and(
            eq(schema.sessions.userId, currentUser.id),
            ne(schema.sessions.sessionToken, currentToken)
          )
        );
    } else {
      // Invalidate all
      await db
        .update(schema.sessions)
        .set({ isValid: false })
        .where(eq(schema.sessions.userId, currentUser.id));
    }

    // Record audit log
    await db.insert(schema.auditLogs).values({
      userId: currentUser.id,
      action: "SESSIONS_REVOKED_BY_USER",
      entity: "sessions",
      newValues: JSON.stringify({ message: "Revoked other active sessions" }),
    });

    return NextResponse.json({ success: true, message: "All other sessions have been revoked." });
  } catch (err: any) {
    console.error("Revoke sessions error:", err);
    return NextResponse.json({ success: false, error: "Failed to revoke sessions" }, { status: 500 });
  }
}
