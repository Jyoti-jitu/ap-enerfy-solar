"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  FileText,
  FilePlus,
  UserPlus,
  Sun,
  Wrench,
  CheckCircle2,
  TrendingUp,
  Receipt,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CreateInvoiceModal } from "@/components/shared/modals/create-invoice-modal";
import { CreateQuotationModal } from "@/components/shared/modals/create-quotation-modal";
import { CreateCustomerModal } from "@/components/shared/modals/create-customer-modal";
import { CreateProjectModal } from "@/components/shared/modals/create-project-modal";
import { SolarPanelIcon, QuoteIcon } from "@/components/shared/icons/solar-panel-icon";

export function DashboardClient({ data }: { data: any }) {
  const { kpis, recentInvoices, revenueTrend } = data;

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
            Billing & Operations for AP Enerfy Solar
          </p>
        </div>

        {/* Date Filter Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 shadow-sm hover:bg-slate-50 cursor-pointer">
            <Calendar className="h-3.5 w-3.5 text-slate-600" />
            <span>Jan 1, 2025 – Jan 31, 2025</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Total Billed"
          value={formatCurrency(kpis.totalBilled)}
          change="+12.5% from last month"
          isPositive={true}
          theme="green"
          iconName="IndianRupee"
        />
        <KPICard
          title="Payments Received"
          value={formatCurrency(kpis.paymentsReceived)}
          change="+14.2%"
          isPositive={true}
          theme="blue"
          iconName="invoice"
        />
        <KPICard
          title="Pending Amount"
          value={formatCurrency(kpis.pendingAmount)}
          change="-5.1%"
          isPositive={false}
          theme="yellow"
          iconName="alertcircle"
        />
        <KPICard
          title="Active Projects"
          value={kpis.activeProjects}
          subtext={`(${kpis.installationCount} Installation · ${kpis.serviceCount} Service)`}
          subtextColor="neutral"
          theme="purple"
          iconName="layers"
        />
      </div>

      {/* Middle Row: Recent Invoices & Revenue Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Invoices Table (Matches image.png) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Invoices</h3>
            <Link
              href="/invoices"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-900 font-bold">
                  <th className="py-2.5 px-3 rounded-l-lg">Invoice No.</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentInvoices.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-950">
                      <Link href="/invoices" className="hover:text-emerald-700">
                        {inv.invoiceNo}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-slate-850 font-medium">{inv.customer}</td>
                    <td className="py-3 px-3 text-slate-950 font-bold">
                      {formatCurrency(inv.amount)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Revenue Trend Chart (Matches image.png) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Revenue Trend</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
              <span>Monthly Billing (₹)</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueTrend}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  tick={{ fill: "#0f172a", fontSize: 11, fontWeight: 600 }}
                  tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), "Revenue"]}
                  contentStyle={{
                    backgroundColor: "#0b1f1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Actions Grid (Matches image.png) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/70 hover:shadow-sm transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                <Receipt className="h-6 w-6" />
              </div>
              <span className="mt-2.5 text-xs font-semibold text-slate-800 text-center">
                Create Invoice
              </span>
            </button>

            <button
              onClick={() => setIsQuotationModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-purple-50/70 border border-purple-100 hover:bg-purple-100/70 hover:shadow-sm transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
                <QuoteIcon className="h-6 w-6" />
              </div>
              <span className="mt-2.5 text-xs font-semibold text-slate-800 text-center">
                New Quotation
              </span>
            </button>

            <button
              onClick={() => setIsCustomerModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-teal-50/70 border border-teal-100 hover:bg-teal-100/70 hover:shadow-sm transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-teal-700 group-hover:scale-105 transition-transform">
                <UserPlus className="h-6 w-6" />
              </div>
              <span className="mt-2.5 text-xs font-semibold text-slate-800 text-center">
                Add Customer
              </span>
            </button>

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-100/70 hover:shadow-sm transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                <SolarPanelIcon className="h-6 w-6" />
              </div>
              <span className="mt-2.5 text-xs font-semibold text-slate-800 text-center">
                Add Project
              </span>
            </button>
          </div>
        </div>

        {/* Right: Active Projects Widget (Matches image.png) */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Active Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <SolarPanelIcon className="h-6 w-6 text-slate-800 mb-2" />
              <span className="text-xl font-extrabold text-slate-950">
                {kpis.installationCount} Installation
              </span>
              <span className="text-xs text-slate-700 font-medium mt-0.5">(In Progress)</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Wrench className="h-6 w-6 text-slate-800 mb-2" />
              <span className="text-xl font-extrabold text-slate-950">
                {kpis.serviceCount} Service
              </span>
              <span className="text-xs text-slate-700 font-medium mt-0.5">(Maintenance)</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-700 mb-2" />
              <span className="text-xl font-extrabold text-emerald-950">
                {kpis.completedCount} Completed
              </span>
              <span className="text-xs text-emerald-800 mt-0.5 font-bold">(This Year)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
      <CreateQuotationModal
        isOpen={isQuotationModalOpen}
        onClose={() => setIsQuotationModalOpen(false)}
      />
      <CreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}
