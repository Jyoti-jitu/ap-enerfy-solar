import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { generateExcelWorkbook } from "@/lib/excel-export";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth-guard";
import { hasPermission } from "@/lib/rbac";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Please sign in." }, { status: 401 });
    }
    if (!hasPermission(user.permissions, `${type}:export`)) {
      return NextResponse.json({ error: `Forbidden: You lack permission to export ${type}.` }, { status: 403 });
    }

    let title = "Export";
    let columns: any[] = [];
    let data: any[] = [];

    switch (type) {
      case "customers": {
        title = "Customers Report";
        columns = [
          { header: "Customer ID", key: "customerId", width: 15 },
          { header: "Customer Name", key: "name", width: 25 },
          { header: "Mobile", key: "mobile", width: 16 },
          { header: "Customer Type", key: "customerType", width: 15 },
          { header: "Solar Capacity (kW)", key: "solarCapacity", width: 18 },
          { header: "Project Status", key: "projectStatus", width: 18 },
          { header: "Outstanding (₹)", key: "outstandingAmount", width: 18 },
          { header: "City", key: "city", width: 16 },
        ];
        data = await db.select().from(schema.customers).orderBy(desc(schema.customers.createdAt));
        break;
      }

      case "invoices": {
        title = "Invoices & Billing Report";
        columns = [
          { header: "Invoice No", key: "invoiceNumber", width: 18 },
          { header: "Customer", key: "customerName", width: 25 },
          { header: "System & Capacity", key: "systemType", width: 20 },
          { header: "Invoice Date", key: "invoiceDate", width: 16 },
          { header: "Taxable (₹)", key: "taxableAmount", width: 16 },
          { header: "GST (₹)", key: "totalTax", width: 14 },
          { header: "Total Amount (₹)", key: "totalAmount", width: 18 },
          { header: "Status", key: "status", width: 14 },
        ];
        const invs = await db.query.invoices.findMany({
          with: { customer: true },
          orderBy: [desc(schema.invoices.invoiceDate)],
        });
        data = invs.map((i: any) => ({
          ...i,
          customerName: i.customer?.name || "Customer",
          invoiceDate: new Date(i.invoiceDate).toLocaleDateString("en-IN"),
        }));
        break;
      }

      case "payments": {
        title = "Payments & Collections Report";
        columns = [
          { header: "Receipt No", key: "receiptNumber", width: 18 },
          { header: "Customer", key: "customerName", width: 25 },
          { header: "Amount (₹)", key: "amount", width: 16 },
          { header: "Payment Type", key: "paymentType", width: 16 },
          { header: "Payment Date", key: "paymentDate", width: 16 },
          { header: "Mode", key: "paymentMode", width: 14 },
          { header: "Status", key: "status", width: 14 },
        ];
        const pms = await db.query.payments.findMany({
          with: { customer: true },
          orderBy: [desc(schema.payments.paymentDate)],
        });
        data = pms.map((p: any) => ({
          ...p,
          customerName: p.customer?.name || "Customer",
          paymentDate: new Date(p.paymentDate).toLocaleDateString("en-IN"),
        }));
        break;
      }

      case "products": {
        title = "Products & Inventory Report";
        columns = [
          { header: "SKU", key: "sku", width: 18 },
          { header: "Product Name", key: "name", width: 30 },
          { header: "Category", key: "category", width: 20 },
          { header: "Brand", key: "brand", width: 16 },
          { header: "Unit Price (₹)", key: "unitPrice", width: 16 },
          { header: "Stock", key: "stockQuantity", width: 14 },
          { header: "Min Stock", key: "minStockThreshold", width: 14 },
          { header: "Status", key: "status", width: 14 },
        ];
        data = await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
        break;
      }

      case "quotations": {
        title = "Quotations Report";
        columns = [
          { header: "Quotation No", key: "quotationNumber", width: 18 },
          { header: "Customer", key: "customerName", width: 25 },
          { header: "System Type", key: "systemType", width: 16 },
          { header: "Capacity (kW)", key: "capacity", width: 16 },
          { header: "Total Amount (₹)", key: "totalAmount", width: 18 },
          { header: "Valid Till", key: "validTill", width: 16 },
          { header: "Status", key: "status", width: 14 },
        ];
        const qts = await db.query.quotations.findMany({
          with: { customer: true },
          orderBy: [desc(schema.quotations.createdAt)],
        });
        data = qts.map((q: any) => ({
          ...q,
          customerName: q.customer?.name || "Customer",
          validTill: new Date(q.validTill).toLocaleDateString("en-IN"),
        }));
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
    }

    const buffer = await generateExcelWorkbook(title, columns, data);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="AP_Enerfy_${type}_${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export failed:", error);
    return NextResponse.json({ error: "Failed to generate Excel" }, { status: 500 });
  }
}
