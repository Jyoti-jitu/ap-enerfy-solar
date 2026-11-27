import { NextRequest, NextResponse } from "next/server";
import { adjustStock } from "@/services/product.service";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }
    if (!hasPermission(user.permissions, "products:update")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to adjust stock." }, { status: 403 });
    }

    const body = await request.json();
    if (!body.productId || body.quantityDelta === undefined) {
      return NextResponse.json({ error: "Product ID and Quantity Delta are required" }, { status: 400 });
    }

    const product = await adjustStock(body.productId, Number(body.quantityDelta), body.reason || "Manual adjustment");
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to adjust stock:", error);
    return NextResponse.json({ error: "Failed to adjust stock" }, { status: 500 });
  }
}
