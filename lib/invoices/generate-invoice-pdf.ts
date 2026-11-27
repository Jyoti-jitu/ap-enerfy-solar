import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/components/invoices/invoice-pdf";
import { formatInvoiceData } from "./format-invoice";
import { InvoiceViewModel } from "./types";

/**
 * Generates high-quality PDF Buffer from either raw DB invoice or formatted InvoiceViewModel
 */
export async function generateInvoicePdf(invoiceOrModel: any): Promise<Buffer> {
  let model: InvoiceViewModel;
  if (invoiceOrModel.calculations && invoiceOrModel.company) {
    model = invoiceOrModel as InvoiceViewModel;
  } else {
    model = await formatInvoiceData(invoiceOrModel);
  }

  const element = React.createElement(InvoicePdfDocument, { model });
  const buffer = await renderToBuffer(element as any);
  return buffer;
}
