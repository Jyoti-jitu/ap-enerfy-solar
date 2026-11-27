import { NextRequest, NextResponse } from "next/server";
import { getCustomers, createCustomer } from "@/services/customer.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const customerType = searchParams.get("customerType") || undefined;
    const projectStatus = searchParams.get("projectStatus") || undefined;
    const city = searchParams.get("city") || undefined;

    const data = await getCustomers({ search, customerType, projectStatus, city });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.mobile) {
      return NextResponse.json({ error: "Name and Mobile are required" }, { status: 400 });
    }

    const customer = await createCustomer(body);
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
  }
}
