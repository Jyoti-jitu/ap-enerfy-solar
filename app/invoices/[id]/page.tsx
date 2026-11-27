import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { eq, or } from "drizzle-orm";
import { formatInvoiceData } from "@/lib/invoices/format-invoice";
import { formatINR } from "@/components/invoices/invoice-constants";
import {
  ArrowLeft,
  Printer,
  Download,
  Edit3,
  ExternalLink,
  Sun,
  CreditCard,
  Building,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface InvoiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailsPage({ params }: InvoiceDetailsPageProps) {
  const { id } = await params;

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

  const getStatusBadge = () => {
    const s = (model.status || "").toLowerCase();
    if (s === "paid") {
      return (
        <Badge className="bg-[#145C32] hover:bg-[#145C32]/90 text-white flex items-center gap-1 font-semibold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Paid in Full
        </Badge>
      );
    }
    if (s === "overdue") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 font-semibold text-xs">
          <AlertTriangle className="w-3.5 h-3.5" />
          Overdue
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 font-semibold text-xs">
        <Clock className="w-3.5 h-3.5" />
        {model.status || "Pending"}
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 p-4 md:p-6">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <Link href="/invoices">
              <ArrowLeft className="w-4 h-4" />
              <span>Invoices</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-slate-900">
                {model.invoiceNumber}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued to {model.customer.name} on {model.invoiceDate}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {model.status !== "Paid" && (
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href={`/invoices/${model.id}/edit`}>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            </Button>
          )}

          <Button variant="outline" size="sm" asChild className="gap-1.5">
            <a href={`/api/invoices/${model.id}/pdf`} download={`${model.invoiceNumber}.pdf`}>
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </a>
          </Button>

          <Button size="sm" asChild className="gap-1.5 bg-[#145C32] hover:bg-[#145C32]/90 text-white shadow-sm font-semibold">
            <Link href={`/invoices/${model.id}/preview`}>
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ready A4 Preview</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Billed</p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatINR(model.calculations.grandTotal)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Gross: {formatINR(model.calculations.grossAmount)}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount Paid</p>
          <p className="text-xl font-bold font-mono text-[#16A34A] mt-1">
            {formatINR(model.calculations.paidAmount)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Cleared via UPI / Bank</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Balance</p>
          <p className={`text-xl font-bold font-mono mt-1 ${model.calculations.balanceAmount > 0 ? "text-rose-600" : "text-[#145C32]"}`}>
            {formatINR(model.calculations.balanceAmount)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Due: {model.dueDate}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total GST</p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatINR(model.calculations.totalTax)}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {model.calculations.isInterState ? "IGST Applied" : "CGST + SGST Split"}
          </p>
        </div>
      </div>

      {/* Main Grid: Details + Quick A4 Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Site Details Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-[#145C32]" />
              Customer & Installation Site Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 text-[11px] uppercase tracking-wider">Client Name</p>
                <p className="font-bold text-slate-900 text-sm">{model.customer.name}</p>
                {model.customer.companyName && (
                  <p className="text-slate-600">{model.customer.companyName}</p>
                )}
                <p className="text-slate-600 mt-1">{model.customer.address}</p>
                <p className="text-slate-600">{model.customer.city}, {model.customer.state} - {model.customer.pincode}</p>
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 text-[11px] uppercase tracking-wider">Contact & GST</p>
                <p className="text-slate-700"><span className="font-semibold">Phone:</span> {model.customer.phone}</p>
                {model.customer.email && (
                  <p className="text-slate-700"><span className="font-semibold">Email:</span> {model.customer.email}</p>
                )}
                <p className="text-slate-700 font-mono">
                  <span className="font-semibold">GSTIN:</span> {model.customer.gstin || "Unregistered"}
                </p>
                <p className="text-slate-700 font-mono">
                  <span className="font-semibold">Place of Supply:</span> {model.placeOfSupply}
                </p>
              </div>
            </div>

            {model.systemDetails && (
              <div className="bg-[#E8F3E5]/60 border border-[#559C32]/40 rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#145C32] mb-2">
                  <Sun className="w-4 h-4 text-[#FFC107] fill-current" />
                  <span>Solar System Specifications</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-800">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Capacity</span>
                    <span className="font-bold text-[#145C32]">{model.systemDetails.capacity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">System Type</span>
                    <span className="font-semibold">{model.systemDetails.systemType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Modules</span>
                    <span className="font-semibold">{model.systemDetails.panelCount || "Mono PERC"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Est. Daily Output</span>
                    <span className="font-semibold text-[#559C32]">{model.systemDetails.estimatedGeneration}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Line items table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Billed Goods & Services</h3>
              <span className="text-xs text-slate-500">{model.items.length} items</span>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-center">HSN</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-center">GST</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {model.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{it.description}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">{it.hsnCode}</td>
                    <td className="py-2.5 px-3 text-center font-semibold">{it.quantity} {it.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatINR(it.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-[#145C32]">{it.gstRate}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{formatINR(it.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Actions & Print Shortcut */}
        <div className="space-y-6">
          {/* Quick Print Preview Banner */}
          <div className="bg-gradient-to-br from-[#145C32] to-[#1e6f3f] text-white p-5 rounded-xl shadow-md space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Printer className="w-4 h-4 text-[#FFC107]" />
              <span>Print-Ready A4 Document</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Standardized GST Tax Invoice formatted according to statutory rules with scannable UPI QR code, bank details, and digital authorization.
            </p>
            <Button asChild className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#145C32] font-bold shadow-sm">
              <Link href={`/invoices/${model.id}/preview`}>
                Open A4 Preview Screen
              </Link>
            </Button>
          </div>

          {/* Payment & Bank Details Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#559C32]" />
              Bank & Payment QR
            </h4>

            <div className="space-y-1 text-slate-600">
              <p><span className="font-semibold text-slate-800">Bank:</span> {model.bankDetails?.bankName}</p>
              <p><span className="font-semibold text-slate-800">A/C:</span> {model.bankDetails?.accountNumber}</p>
              <p><span className="font-semibold text-slate-800">IFSC:</span> {model.bankDetails?.ifscCode}</p>
              <p><span className="font-semibold text-slate-800">UPI:</span> {model.bankDetails?.upiId}</p>
            </div>

            {model.paymentQrCodeUrl && model.calculations.balanceAmount > 0 && (
              <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={model.paymentQrCodeUrl}
                  alt="UPI QR Code"
                  className="w-28 h-28 object-contain border border-slate-200 rounded p-1"
                />
                <p className="text-[11px] font-bold text-[#145C32] mt-1">Scan & Pay via UPI</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
