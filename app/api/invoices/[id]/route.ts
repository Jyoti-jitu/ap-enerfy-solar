import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (user && !hasPermission(user.permissions, "invoices:view")) {
      return NextResponse.json({ error: "Forbidden: You lack permission to view invoices." }, { status: 403 });
    }

    const { id } = await params;
    const [invoice] = await db.query.invoices.findMany({
      where: eq(schema.invoices.id, id),
      with: {
        customer: true,
        project: true,
        items: {
          with: {
            product: true,
          },
        },
      },
      limit: 1,
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(user.permissions, "invoices:edit")) {
      return NextResponse.json({ error: "Forbidden: Lacks permission to edit invoices." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(schema.invoices)
      .set({
        status: body.status || undefined,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        terms: body.terms !== undefined ? body.terms : undefined,
        notes: body.notes !== undefined ? body.notes : undefined,
        taxableAmount: body.taxableAmount !== undefined ? String(body.taxableAmount) : undefined,
        totalTax: body.totalTax !== undefined ? String(body.totalTax) : undefined,
        totalAmount: body.totalAmount !== undefined ? String(body.totalAmount) : undefined,
        paidAmount: body.paidAmount !== undefined ? String(body.paidAmount) : undefined,
        balanceAmount: body.balanceAmount !== undefined ? String(body.balanceAmount) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(schema.invoices.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update invoice:", error);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!hasPermission(user.permissions, "invoices:delete")) {
      return NextResponse.json({ error: "Forbidden: Lacks permission to delete invoices." }, { status: 403 });
    }

    const { id } = await params;
    await db.delete(schema.invoices).where(eq(schema.invoices.id, id));

    return NextResponse.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
