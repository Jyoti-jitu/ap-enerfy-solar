"use client";

import React from "react";
import { KPICard } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  Download,
  FileSpreadsheet,
  Printer,
  Sun,
  TreePine,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  DollarSign,
  CreditCard,
  Users,
  HardHat,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function ReportsClient({ data }: { data: any }) {
  const {
    kpis,
    revenueOverview,
    salesByProduct,
    installationStatus,
    topCustomers,
    recentActivities,
    environmentalImpact,
  } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Powerful insights for your solar business
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>Jan 1, 2025 – Jan 31, 2025</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5 text-rose-500" />
            <span>Export PDF</span>
          </button>

          <a
            href="/api/export/invoices"
            download
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </a>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Pastel KPI Cards Grid (Matches image copy 6.png - 6 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KPICard
          title="Total Sales"
          value={formatCurrency(kpis.totalSales)}
          change="↑ 12.5%"
          isPositive={true}
          theme="green"
          iconName="rupee"
        />
        <KPICard
          title="Total Invoices"
          value={kpis.totalInvoices}
          change="↑ 8.7%"
          isPositive={true}
          theme="blue"
          iconName="invoice"
        />
        <KPICard
          title="Total Collections"
          value={formatCurrency(kpis.totalCollections)}
          change="↑ 14.1%"
          isPositive={true}
          theme="yellow"
          iconName="invoice"
        />
        <KPICard
          title="Total Customers"
          value={kpis.totalCustomers}
          change="↑ 6.4%"
          isPositive={true}
          theme="purple"
          iconName="users"
        />
        <KPICard
          title="Projects Completed"
          value={kpis.projectsCompleted}
          change="↑ 13.5%"
          isPositive={true}
          theme="blue"
          iconName="sun"
        />
        <KPICard
          title="Installed Capacity"
          value={`${kpis.installedCapacity} kW`}
          change="↑ 18.2%"
          isPositive={true}
          theme="yellow"
          iconName="sun"
        />
      </div>

      {/* Middle Row: Revenue Overview Bar Chart + Sales by Product & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Overview Bar Chart (Matches image copy 6.png) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Revenue Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Revenue
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueOverview}
                margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
                barGap={6}
              >
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
                  tickFormatter={(val) => `${val}L`}
                />
                <Tooltip
                  formatter={(val: any) => [`₹ ${val} Lakhs`, ""]}
                  contentStyle={{
                    backgroundColor: "#0b1f1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#facc15" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Sales by Product Donut & Solar Impact */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Sales by Product Donut Chart (Matches image copy 6.png) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex-1">
            <h3 className="text-base font-bold text-slate-900 mb-2">Sales by Product</h3>
            <div className="flex items-center justify-between gap-4">
              <div className="relative h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByProduct}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {salesByProduct.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm font-extrabold text-slate-950">₹ 24.9L</span>
                  <span className="text-[10px] text-slate-800 font-bold">Total Sales</span>
                </div>
              </div>

              <div className="space-y-2 text-xs flex-1">
                {salesByProduct.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Solar Energy Impact Card (Matches image copy 6.png) */}
          <div className="rounded-xl border border-amber-100 bg-[#fefbf0] p-4 shadow-sm">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <Sun className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Solar Energy Impact</span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {environmentalImpact.capacityKw} kW
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Total Capacity Installed
                </p>
              </div>

              <div className="border-l border-amber-200/80 pl-4">
                <p className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                  <TreePine className="h-4 w-4 text-emerald-600" />
                  ≈ 1,32,000 kg
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  CO₂ Avoided Annually
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Installation Status Donut, Top Customers, Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Installation Status (Matches image copy 6.png) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            Installation Status
          </h3>

          <div className="flex items-center gap-5">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-8 border-emerald-500 border-t-blue-500 border-r-amber-400">
              <div className="text-center">
                <span className="text-xl font-bold text-slate-900">92%</span>
                <span className="block text-[10px] text-slate-400">Completed</span>
              </div>
            </div>

            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Completed
                </span>
                <span className="font-bold text-slate-900">
                  {installationStatus.completed}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  In Progress
                </span>
                <span className="font-bold text-slate-900">
                  {installationStatus.inProgress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Pending
                </span>
                <span className="font-bold text-slate-900">
                  {installationStatus.pending}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  On Hold
                </span>
                <span className="font-bold text-slate-900">
                  {installationStatus.onHold}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers (Matches image copy 6.png) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Top Customers</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold pb-2">
                <th className="pb-2">Customer</th>
                <th className="pb-2 text-right">Total Business</th>
                <th className="pb-2 text-right">Last Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topCustomers.map((cust: any) => (
                <tr key={cust.name} className="hover:bg-slate-50/50">
                  <td className="py-2.5 font-medium text-slate-800">{cust.name}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    {formatCurrency(cust.totalBusiness)}
                  </td>
                  <td className="py-2.5 text-right text-slate-500">{cust.lastInvoice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activities (Matches image copy 6.png) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recent Activities</h3>
            <span className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer flex items-center gap-0.5">
              View All <ArrowRight className="h-3 w-3" />
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span className="text-slate-700 leading-snug truncate">
                    {act.text}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
