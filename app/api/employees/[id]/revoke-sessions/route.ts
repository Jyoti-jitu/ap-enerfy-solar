import { NextResponse } from "next/server";
import { revokeUserSessions, getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Allow users to revoke their own sessions or administrators to revoke employee sessions
  const isSelf = currentUser.id === id;
  const isAdmin = hasPermission(currentUser.permissions, "employees.deactivate") || hasPermission(currentUser.permissions, "settings.manage");

  if (!isSelf && !isAdmin) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const success = await revokeUserSessions(id);
    return NextResponse.json({ success, message: "All active sessions revoked immediately." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to revoke sessions" }, { status: 500 });
  }
}
