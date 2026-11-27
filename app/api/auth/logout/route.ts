import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("ap_solar_session")?.value;

    if (sessionToken) {
      await AuthService.logout(sessionToken);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.delete("ap_solar_session");
    response.cookies.delete("ap_user_role");
    response.cookies.delete("ap_user_name");

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
