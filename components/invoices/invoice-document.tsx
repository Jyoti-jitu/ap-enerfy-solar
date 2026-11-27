import React from "react";
import { InvoiceViewModel } from "@/lib/invoices/types";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceTitle } from "./invoice-title";
import { InvoiceCustomerDetails } from "./invoice-customer-details";
import { InvoiceItemsTable } from "./invoice-items-table";
import { InvoiceSystemDetails } from "./invoice-system-details";
import { InvoiceTaxSummary } from "./invoice-tax-summary";
import { InvoiceTotals } from "./invoice-totals";
import { InvoiceAmountInWords } from "./invoice-amount-in-words";
import { InvoiceBankDetails } from "./invoice-bank-details";
import { InvoicePaymentQr } from "./invoice-payment-qr";
import { InvoiceTerms } from "./invoice-terms";
import { InvoiceSignature } from "./invoice-signature";
import { InvoiceFooter } from "./invoice-footer";

interface InvoiceDocumentProps {
  model: InvoiceViewModel;
  className?: string;
}

export function InvoiceDocument({ model, className = "" }: InvoiceDocumentProps) {
  const isInterState = model.calculations.isInterState;

  return (
    <div
      id="invoice-printable-document"
      className={`invoice-a4-sheet bg-white text-[#172B2A] font-sans mx-auto p-7 md:p-8 relative flex flex-col justify-between ${className}`}
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Header */}
        <InvoiceHeader company={model.company} />

        {/* Title */}
        <InvoiceTitle title={model.documentTitle} />

        {/* Customer & Invoice Details */}
        <InvoiceCustomerDetails
          customer={model.customer}
          shippingAddress={model.shippingAddress}
          invoiceNumber={model.invoiceNumber}
          invoiceDate={model.invoiceDate}
          dueDate={model.dueDate}
          salesOrderNumber={model.salesOrderNumber}
          quotationRef={model.quotationRef}
          projectRef={model.projectRef}
          placeOfSupply={model.placeOfSupply}
          stateCode={model.stateCode}
          reverseCharge={model.reverseCharge}
        />

        {/* Itemized Goods & Services Table */}
        <InvoiceItemsTable items={model.items} isInterState={isInterState} />

        {/* Solar System Details (if applicable) */}
        {model.systemDetails && (
          <InvoiceSystemDetails details={model.systemDetails} />
        )}

        {/* Tax Summary & Financial Summary Section */}
        <div className="grid grid-cols-12 gap-3 mb-3 items-start">
          <div className="col-span-7 flex flex-col gap-2">
            <InvoiceTaxSummary
              hsnSummary={model.calculations.hsnSummary}
              isInterState={isInterState}
            />

            <div className="flex gap-2 items-stretch">
              <InvoiceBankDetails bankDetails={model.bankDetails} />
              <InvoicePaymentQr
                qrCodeUrl={model.paymentQrCodeUrl}
                upiId={model.bankDetails?.upiId}
                balanceAmount={model.calculations.balanceAmount}
                invoiceNumber={model.invoiceNumber}
              />
            </div>
          </div>

          <div className="col-span-5">
            <InvoiceTotals
              calculations={model.calculations}
              isInterState={isInterState}
            />
          </div>
        </div>

        {/* Amount in words */}
        <InvoiceAmountInWords amountInWords={model.calculations.amountInWords} />

        {/* Terms and Signature */}
        <div className="flex gap-3 items-stretch mb-2">
          <InvoiceTerms
            terms={model.termsAndConditions}
            notes={model.notes}
          />
          <InvoiceSignature
            companyName={model.authorizedSignatory.companyName}
            designation={model.authorizedSignatory.designation}
            signatoryName={model.authorizedSignatory.signatoryName}
          />
        </div>
      </div>

      {/* Footer */}
      <InvoiceFooter />

      {/* Embedded Print CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide all application layout elements */
          nav, aside, header, footer:not(.invoice-a4-sheet footer), .no-print, button, .invoice-toolbar-root {
            display: none !important;
          }
          .invoice-workspace-bg {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-a4-sheet {
            width: 100% !important;
            min-height: auto !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          table {
            page-break-inside: avoid;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
