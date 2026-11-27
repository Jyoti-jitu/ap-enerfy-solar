"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_TYPES } from "@/lib/constants";
import {
  Plus,
  Link as LinkIcon,
  Receipt,
  Download,
  Calendar,
  Search,
  Eye,
  Printer,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { RecordPaymentModal } from "@/components/shared/modals/record-payment-modal";

export function PaymentsClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState("Payment Entries");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const tabs = [
    { name: "Payment Entries", icon: CreditCard },
    { name: "Installment Schedule", icon: Calendar },
    { name: "Customer Ledger", icon: BookOpen },
    { name: "Outstanding", icon: AlertTriangle },
    { name: "Refunds", icon: RotateCcw },
  ];

  const filtered = data.payments.filter((p: any) => {
    if (search && !p.receiptNumber.toLowerCase().includes(search.toLowerCase()) && !p.customer?.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedType !== "All Types" && p.paymentType !== selectedType) {
      return false;
    }
    if (selectedStatus !== "All Status" && p.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments & Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track payments, advances, installments and outstanding balances
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => alert("Payment link copied to clipboard for WhatsApp/SMS dispatch.")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <LinkIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>Payment Link</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Receipt className="h-3.5 w-3.5 text-slate-500" />
            <span>Receipt</span>
          </button>

          <a
            href="/api/export/payments"
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy 5.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title="Total Receipts"
          value={formatCurrency(data.kpis.totalReceipts)}
          change="↑ +82.3% collection"
          isPositive={true}
          theme="green"
          iconName="invoice"
        />
        <KPICard
          title="Advance Received"
          value={formatCurrency(data.kpis.advanceReceived)}
          subtext="(12 customers)"
          subtextColor="blue"
          theme="blue"
          iconName="layers"
        />
        <KPICard
          title="Outstanding"
          value={formatCurrency(data.kpis.outstanding)}
          subtext="(18 invoices)"
          subtextColor="amber"
          theme="yellow"
          iconName="alertcircle"
        />
        <KPICard
          title="Overdue"
          value={formatCurrency(data.kpis.overdue)}
          subtext="(5 invoices)"
          subtextColor="rose"
          theme="rose"
          iconName="calendar"
        />
        <KPICard
          title="Collection Rate"
          value={data.kpis.collectionRate}
          subtext="This month"
          subtextColor="emerald"
          theme="purple"
          iconName="percent"
        />
      </div>

      {/* Sub Tabs (Matches image copy 5.png) */}
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

      {activeTab === "Payment Entries" && (
        <>
          {/* Filter Bar (Matches image copy 5.png) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by receipt no., invoice no. or customer..."
                  className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Payment Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Types">All Types</option>
                  {PAYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Status">All Status</option>
                  <option value="Received">Received</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Pending">Pending</option>
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

          {/* Table (Matches image copy 5.png) */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="py-3 px-3 w-10 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    </th>
                    <th className="py-3 px-3">Receipt No.</th>
                    <th className="py-3 px-3">Invoice No.</th>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3 text-right">Amount (₹)</th>
                    <th className="py-3 px-3">Payment Type</th>
                    <th className="py-3 px-3">Payment Date</th>
                    <th className="py-3 px-3">Mode</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((pay: any) => (
                    <tr
                      key={pay.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedPayment(pay)}
                    >
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {pay.receiptNumber}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {pay.invoice?.invoiceNumber || "INV-2025-0141"}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {pay.customer?.name}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(pay.amount)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={pay.paymentType} />
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(pay.paymentDate)}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 border text-[11px]">
                          {pay.paymentMode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={pay.status} />
                      </td>
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                          <button
                            onClick={() => setSelectedPayment(pay)}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="View Receipt"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Print Voucher"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
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
                Showing 1-{Math.min(filtered.length, 8)} of {data.totalCount} payments
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
        </>
      )}

      {/* Customer Ledger Tab */}
      {activeTab === "Customer Ledger" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
          <BookOpen className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">Customer Accounts Ledger</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Running debit/credit ledger tracking invoices issued, milestone advance deposits, and subsidy settlements.
          </p>
        </div>
      )}

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase">
                  {selectedPayment.receiptNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Receipt Voucher
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                <span className="text-xs text-slate-500">Amount Received</span>
                <p className="text-2xl font-bold text-emerald-800 mt-0.5">
                  {formatCurrency(selectedPayment.amount)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Customer</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.customer?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mode</span>
                  <span className="font-semibold text-slate-800">{selectedPayment.paymentMode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Reference / UTR</span>
                  <span className="font-medium text-slate-800">{selectedPayment.referenceNumber || "UPI/502910"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Bank</span>
                  <span className="font-medium text-slate-800">{selectedPayment.bankName || "HDFC Bank"}</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetch("/api/payments")
            .then((r) => r.json())
            .then((d) => setData(d));
        }}
      />
    </div>
  );
}
