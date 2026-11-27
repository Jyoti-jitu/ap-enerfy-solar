import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { getCurrentUser } from "@/lib/auth-guard";
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

  if (!hasPermission(currentUser.permissions, "employees.update") && !hasPermission(currentUser.permissions, "roles.manage")) {
    return NextResponse.json({ success: false, error: "Forbidden: Super Admin access required" }, { status: 403 });
  }

  try {
    const { roleSlug } = await req.json();
    if (!roleSlug) {
      return NextResponse.json({ success: false, error: "roleSlug is required" }, { status: 400 });
    }

    const result = await AuthService.changeUserRole(id, roleSlug, currentUser.id);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "Failed to update role" }, { status: 500 });
  }
}
