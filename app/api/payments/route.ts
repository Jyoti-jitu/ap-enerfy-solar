import { NextRequest, NextResponse } from "next/server";
import { getPayments, recordPayment } from "@/services/payment.service";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && !hasPermission(user.permissions, "payments:view")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to view payments." }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const paymentType = searchParams.get("paymentType") || undefined;
    const status = searchParams.get("status") || undefined;
    const paymentMode = searchParams.get("paymentMode") || undefined;

    const data = await getPayments({ search, paymentType, status, paymentMode });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }
    if (!hasPermission(user.permissions, "payments:create")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to record payments." }, { status: 403 });
    }

    const body = await request.json();
    if (!body.customerId || !body.amount) {
      return NextResponse.json({ error: "Customer and Amount are required" }, { status: 400 });
    }

    const payment = await recordPayment({
      ...body,
      paymentDate: new Date(body.paymentDate || Date.now()),
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Failed to record payment:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
