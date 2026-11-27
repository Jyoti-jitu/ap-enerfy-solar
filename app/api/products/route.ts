import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct, adjustStock } from "@/services/product.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const stockStatus = searchParams.get("stockStatus") || undefined;

    const data = await getProducts({ search, category, brand, stockStatus });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to get products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.sku || !body.name) {
      return NextResponse.json({ error: "SKU and Name are required" }, { status: 400 });
    }

    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
