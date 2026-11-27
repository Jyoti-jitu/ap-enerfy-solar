import React from "react";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { eq, or } from "drizzle-orm";
import { formatInvoiceData } from "@/lib/invoices/format-invoice";
import { InvoicePreview } from "@/components/invoices/invoice-preview";

export const dynamic = "force-dynamic";

interface InvoicePreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoicePreviewPage({ params }: InvoicePreviewPageProps) {
  const { id } = await params;

  // Search by UUID id or invoiceNumber
  const [invoice] = await db.query.invoices.findMany({
    where: or(
      eq(schema.invoices.id, id),
      eq(schema.invoices.invoiceNumber, id)
    ),
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
    notFound();
  }

  const model = await formatInvoiceData(invoice);

  return <InvoicePreview model={model} />;
}
