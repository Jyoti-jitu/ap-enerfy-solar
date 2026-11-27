import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { success: false, error: "User ID and new password are required." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || undefined;
    const result = await AuthService.changePassword(userId, currentPassword || "", newPassword, ip);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to change password." },
      { status: 500 }
    );
  }
}
