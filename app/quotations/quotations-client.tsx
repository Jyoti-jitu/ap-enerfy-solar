"use client";

import React, { useState } from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SYSTEM_TYPES } from "@/lib/constants";
import {
  Plus,
  FileText,
  Calendar,
  ChevronDown,
  Search,
  Download,
  Eye,
  Pencil,
  Copy,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Package,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { CreateQuotationModal } from "@/components/shared/modals/create-quotation-modal";

export function QuotationsClient({
  initialData,
  solarPlans,
}: {
  initialData: any;
  solarPlans: any[];
}) {
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<"quotations" | "plans" | "revisions">("quotations");
  const [search, setSearch] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null);

  const filtered = data.quotations.filter((q: any) => {
    if (search && !q.quotationNumber.toLowerCase().includes(search.toLowerCase()) && !q.customer?.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedSystem !== "All Types" && q.systemType !== selectedSystem) {
      return false;
    }
    if (selectedStatus !== "All Status" && q.status !== selectedStatus) {
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
            Quotations & Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create solar quotations, manage revisions and solar system plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Quotation</span>
          </button>

          <button
            onClick={() => setActiveTab("plans")}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Package className="h-3.5 w-3.5 text-slate-500" />
            <span>Solar Plans</span>
          </button>

          <a
            href="/api/export/quotations"
            download
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export</span>
          </a>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KPICard
          title="Total Quotations"
          value={data.kpis.totalQuotations}
          change="+22 this month"
          isPositive={true}
          theme="green"
          iconName="filetext"
        />
        <KPICard
          title="Sent to Customers"
          value={data.kpis.sentToCustomers}
          subtext="70.9% of total"
          subtextColor="blue"
          theme="blue"
          iconName="send"
        />
        <KPICard
          title="Accepted"
          value={data.kpis.accepted}
          subtext="52.7% conversion"
          subtextColor="emerald"
          theme="yellow"
          iconName="checkcircle"
        />
        <KPICard
          title="Pending"
          value={data.kpis.pending}
          subtext="18.3%"
          subtextColor="amber"
          theme="rose"
          iconName="clock"
        />
        <KPICard
          title="Lost / Declined"
          value={data.kpis.lost}
          subtext="6.4%"
          subtextColor="rose"
          theme="purple"
          iconName="xcircle"
        />
      </div>

      {/* Tab Nav (Matches image copy.png) */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-sm font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab("quotations")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "quotations"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Quotations</span>
        </button>

        <button
          onClick={() => setActiveTab("plans")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "plans"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Solar Plans / Packages</span>
        </button>

        <button
          onClick={() => setActiveTab("revisions")}
          className={`flex items-center gap-2 pb-3 transition-colors relative ${
            activeTab === "revisions"
              ? "text-emerald-700 border-b-2 border-emerald-600 font-bold"
              : "hover:text-slate-800"
          }`}
        >
          <History className="h-4 w-4" />
          <span>Revisions</span>
        </button>
      </div>

      {activeTab === "quotations" && (
        <>
          {/* Filter Bar (Matches image copy.png) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-5 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by quotation no., customer or mobile..."
                  className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                  System Type
                </label>
                <select
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-200 px-2.5 text-xs text-slate-700 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="All Types">All Types</option>
                  {SYSTEM_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
                  <option value="Accepted">Accepted</option>
                  <option value="Pending">Pending</option>
                  <option value="Revision">Revision</option>
                  <option value="Sent">Sent</option>
                  <option value="Lost">Lost</option>
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

          {/* Quotations Data Table (Matches image copy.png) */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                    <th className="py-3 px-3 w-10 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                    </th>
                    <th className="py-3 px-3">Quotation No.</th>
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">System Type</th>
                    <th className="py-3 px-3">Capacity</th>
                    <th className="py-3 px-3">Amount (₹)</th>
                    <th className="py-3 px-3">Valid Till</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((q: any) => (
                    <tr
                      key={q.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => setSelectedQuotation(q)}
                    >
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {q.quotationNumber}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800">
                        {q.customer?.name}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={q.systemType} type="system" />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {q.capacity} kW
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {formatCurrency(q.totalAmount)}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {formatDate(q.validTill)}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={q.status} />
                      </td>
                      <td
                        className="py-3 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-slate-500">
                          <button
                            onClick={() => setSelectedQuotation(q)}
                            className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded"
                            title="View Quotation"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-emerald-600 hover:bg-emerald-50 rounded" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded" title="Duplicate">
                            <Copy className="h-3.5 w-3.5" />
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
                Showing 1-{Math.min(filtered.length, 8)} of {data.totalCount} quotations
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
                  24
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

      {/* Solar Plans Tab */}
      {activeTab === "plans" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solarPlans.map((plan: any) => (
            <div
              key={plan.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-500 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {plan.planCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {plan.name}
                  </h3>
                </div>
                <StatusBadge status={plan.systemType} type="system" />
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">System Capacity:</span>
                  <span className="font-bold text-slate-900">{plan.capacityKw} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Generation:</span>
                  <span className="font-semibold text-emerald-700">
                    ~{plan.estimatedMonthlyUnits} units/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Package Base Price:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(plan.basePrice)}
                  </span>
                </div>
                {Number(plan.subsidyAmount) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>PM Surya Ghar Subsidy:</span>
                    <span>- {formatCurrency(plan.subsidyAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>Effective Client Price:</span>
                  <span className="text-emerald-700">
                    {formatCurrency(plan.netCustomerPrice)}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                {plan.description}
              </p>

              <button
                onClick={() => {
                  setActiveTab("quotations");
                  setIsModalOpen(true);
                }}
                className="mt-4 w-full py-2 rounded-lg bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Use in Quotation
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Revisions Tab */}
      {activeTab === "revisions" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <History className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">Quotation Revisions Log</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            All design revisions (such as Greenfield Farm QT-2025-0183 Rev 2) are automatically versioned with historical component pricing.
          </p>
        </div>
      )}

      {/* Quotation Detail Modal */}
      {selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase">
                  {selectedQuotation.quotationNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedQuotation.customer?.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">System Type</span>
                  <StatusBadge status={selectedQuotation.systemType} type="system" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Capacity</span>
                  <span className="font-semibold text-slate-800">{selectedQuotation.capacity} kW</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total Quote Amount</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(selectedQuotation.totalAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Status</span>
                  <StatusBadge status={selectedQuotation.status} />
                </div>
              </div>
              <p>{selectedQuotation.notes || "Proposal terms valid for 30 days."}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSelectedQuotation(null)}
                className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <CreateQuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetch("/api/quotations")
            .then((r) => r.json())
            .then((d) => setData(d));
        }}
      />
    </div>
  );
}
