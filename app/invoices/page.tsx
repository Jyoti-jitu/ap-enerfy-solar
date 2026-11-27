import React from "react";
import { getInvoices } from "@/services/invoice.service";
import { InvoicesClient } from "./invoices-client";

export const dynamic = "force-dynamic";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : undefined;
  const invoiceType = typeof params.invoiceType === "string" ? params.invoiceType : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const financialYear = typeof params.financialYear === "string" ? params.financialYear : undefined;

  const data = await getInvoices({ search, invoiceType, status, financialYear });

  return <InvoicesClient initialData={data} />;
}
