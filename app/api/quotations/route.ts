import { NextRequest, NextResponse } from "next/server";
import { getQuotations, createQuotation } from "@/services/quotation.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const systemType = searchParams.get("systemType") || undefined;
    const status = searchParams.get("status") || undefined;

    const data = await getQuotations({ search, systemType, status });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get quotations:", error);
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.customerId || !body.totalAmount) {
      return NextResponse.json({ error: "Customer and Amount are required" }, { status: 400 });
    }

    const quotation = await createQuotation({
      ...body,
      validTill: new Date(body.validTill || Date.now() + 30 * 86400000),
    });
    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error("Failed to create quotation:", error);
    return NextResponse.json({ error: "Failed to create quotation" }, { status: 500 });
  }
}
