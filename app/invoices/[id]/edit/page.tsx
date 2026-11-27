import React from "react";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { eq, or } from "drizzle-orm";
import { EditInvoiceClient } from "./edit-invoice-client";

export const dynamic = "force-dynamic";

interface EditInvoicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
  const { id } = await params;

  const [invoice] = await db.query.invoices.findMany({
    where: or(
      eq(schema.invoices.id, id),
      eq(schema.invoices.invoiceNumber, id)
    ),
    limit: 1,
  });

  if (!invoice) {
    notFound();
  }

  return <EditInvoiceClient invoice={invoice} />;
}
