"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INVOICE_TYPES } from "@/lib/constants";
import {
  Plus,
  Printer,
  Download,
  Calendar,
  ChevronDown,
  Search,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Receipt,
  FileText,
  Truck,
  RotateCcw,
} from "lucide-react";
import { CreateInvoiceModal } from "@/components/shared/modals/create-invoice-modal";

export function InvoicesClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("Tax Invoices");
  const [search, setSearch] = useState("");
  const [selectedFY, setSelectedFY] = useState("2024-2025");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const tabs = [
    { name: "Tax Invoices", icon: Receipt },
    { name: "Proforma Invoice", icon: FileText },
    { name: "Delivery Challan", icon: Truck },
    { name: "Credit / Debit Note", icon: RotateCcw },
    { name: "Payment Receipts", icon: Receipt },
  ];

  const filtered = data.invoices.filter((inv: any) => {
    if (search && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) && !inv.customer?.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedType !== "All Types" && inv.invoiceType !== selectedType) {
      return false;
    }
    if (selectedStatus !== "All Status" && inv.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Invoices & Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create GST invoices, proforma, delivery challans and payment receipts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <a
            href="/api/export/invoices"
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy 2.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title="Total Invoices"
          value={data.kpis.totalInvoices}
          change="+18.6% this month"
          isPositive={true}
          theme="green"
          iconName="filetext"
        />
        <KPICard
          title="Billed Amount"
          value={formatCurrency(data.kpis.billedAmount)}
          change="+12.5%"
          isPositive={true}
          theme="blue"
          iconName="rupee"
        />
        <KPICard
          title="Amount Received"
          value={formatCurrency(data.kpis.amountReceived)}
          subtext="82.3% collection"
          subtextColor="emerald"
          theme="yellow"
          iconName="invoice"
        />
        <KPICard
          title="Outstanding"
          value={formatCurrency(data.kpis.outstanding)}
          subtext="17.7%"
          subtextColor="rose"
          theme="rose"
          iconName="alertcircle"
        />
        <KPICard
          title="GST (This Month)"
          value={formatCurrency(data.kpis.gstThisMonth)}
          theme="purple"
          iconName="percent"
        />
      </div>

      {/* Sub Tabs (Matches image copy 2.png) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-semibold text-slate-500 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 pb-3 whitespace-nowrap transition-colors relative ${
                isActive
                  ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
                  : "hover:text-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar (Matches image copy 2.png) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice no., customer or mobile..."
              className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              Financial Year
            </label>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="2025-2026">2025 – 2026</option>
              <option value="2024-2025">2024 – 2025</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              Invoice Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="All Types">All Types</option>
              {INVOICE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="lg:col-span-2 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg mt-3.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Jan 1 – Jan 31</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Invoices Table (Matches image copy 2.png) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-950 font-bold">
                <th className="py-3 px-3 w-10 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                </th>
                <th className="py-3 px-3">Invoice No.</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">System / Capacity</th>
                <th className="py-3 px-3">Invoice Date</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3 text-right">GST (₹)</th>
                <th className="py-3 px-3 text-right">Total (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv: any) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                  onClick={() => setSelectedInvoice(inv)}
                >
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">
                    {inv.customer?.name}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge
                      status={`${inv.systemType} – ${inv.capacity} kW`}
                      type="system"
                    />
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {formatDate(inv.invoiceDate)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    {Number(inv.taxableAmount).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-700">
                    {Number(inv.totalTax).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td
                    className="py-3 px-3 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                      <Link
                        href={`/invoices/${inv.id}/preview`}
                        className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="A4 Print Preview"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/invoices/${inv.id}/preview`}
                        className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Print Invoice"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Link>
                      <a
                        href={`/api/invoices/${inv.id}/pdf`}
                        download={`${inv.invoiceNumber}.pdf`}
                        className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                        title="Download PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </a>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded"
                        title="Invoice Details"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing 1-{Math.min(filtered.length, 8)} of {data.totalCount} invoices
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronsLeft className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button className="h-7 w-7 rounded-lg bg-emerald-700 text-white font-semibold shadow-sm">
              1
            </button>
            <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
              2
            </button>
            <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="h-7 w-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
              19
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
              <ChevronsRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Quick View Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  {selectedInvoice.invoiceNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedInvoice.customer?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Invoice Date</span>
                  <span className="font-semibold text-slate-900">
                    {formatDate(selectedInvoice.invoiceDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Due Date</span>
                  <span className="font-semibold text-slate-900">
                    {formatDate(selectedInvoice.dueDate)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Taxable Amount</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(selectedInvoice.taxableAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Total GST Tax</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(selectedInvoice.totalTax)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Total Invoice Value</span>
                  <span className="text-base font-black text-slate-950">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-700 font-bold block text-[10px]">Payment Status</span>
                  <StatusBadge status={selectedInvoice.status} />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
              <div className="flex items-center gap-2">
                <Link
                  href={`/invoices/${selectedInvoice.id}/preview`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#145C32] text-white text-xs font-semibold hover:bg-[#145C32]/90 shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>A4 Print Preview</span>
                </Link>

                <a
                  href={`/api/invoices/${selectedInvoice.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1.5 rounded hover:bg-emerald-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>PDF Stream</span>
                </a>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetch("/api/invoices")
            .then((r) => r.json())
            .then((d) => setData(d));
        }}
      />
    </div>
  );
}
