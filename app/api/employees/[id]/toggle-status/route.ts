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
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in." },
      { status: 401 }
    );
  }

  if (!hasPermission(currentUser.permissions, "employees:admin")) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Super Admin access required." },
      { status: 403 }
    );
  }

  try {
    const { status } = await req.json();
    if (!status || !["Active", "Inactive", "Suspended"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    const result = await AuthService.updateEmployeeStatus(id, status, currentUser?.id);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update employee status." },
      { status: 500 }
    );
  }
}
