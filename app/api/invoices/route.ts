import { NextRequest, NextResponse } from "next/server";
import { getInvoices, createInvoice } from "@/services/invoice.service";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user && !hasPermission(user.permissions, "invoices:view")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to view invoices." }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const invoiceType = searchParams.get("invoiceType") || undefined;
    const status = searchParams.get("status") || undefined;
    const financialYear = searchParams.get("financialYear") || undefined;

    const data = await getInvoices({ search, invoiceType, status, financialYear });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get invoices:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }
    if (!hasPermission(user.permissions, "invoices:create")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to create invoices." }, { status: 403 });
    }

    const body = await request.json();
    if (!body.customerId || !body.taxableAmount) {
      return NextResponse.json({ error: "Customer and Taxable Amount are required" }, { status: 400 });
    }

    const invoice = await createInvoice({
      ...body,
      invoiceDate: new Date(body.invoiceDate || Date.now()),
      dueDate: new Date(body.dueDate || Date.now() + 15 * 86400000),
    });
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
