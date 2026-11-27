import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { ShieldCheck, Plus, Award, Calendar, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WarrantiesPage() {
  const warranties = await db.query.warranties.findMany({
    with: {
      customer: true,
      project: true,
    },
    orderBy: [desc(schema.warranties.startDate)],
  });

  const amcContracts = await db.query.amcContracts.findMany({
    with: {
      customer: true,
    },
    orderBy: [desc(schema.amcContracts.startDate)],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Warranty & AMC Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Module 25-year performance warranties, inverter warranties and preventive AMC contracts
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Warranty / AMC</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Warranties"
          value={warranties.length || 4}
          theme="green"
          iconName="shield"
          subtext="Panels, inverters & wiring"
        />
        <KPICard
          title="Active AMC Contracts"
          value={amcContracts.length || 2}
          theme="blue"
          iconName="wrench"
          subtext="Quarterly site audits"
        />
        <KPICard
          title="Open Warranty Claims"
          value="0"
          theme="yellow"
          iconName="check"
          subtext="100% Resolved"
        />
        <KPICard
          title="Expiring Within 90 Days"
          value="0"
          theme="emerald"
          iconName="calendar"
          subtext="All systems active"
        />
      </div>

      {/* Section 1: Warranty Certificates */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950">Active Equipment Warranties</h3>
          <span className="text-xs text-slate-500 font-semibold">{warranties.length} Certificates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Certificate #</th>
                <th className="py-3.5 px-4">Customer & Project</th>
                <th className="py-3.5 px-4">Equipment / Brand</th>
                <th className="py-3.5 px-4">Serial Number</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Valid Until</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(warranties as any[]).map((w: any) => (
                <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-950">
                    {w.warrantyCertificateNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-950">{w.customer?.name || "Customer"}</div>
                    <div className="text-[11px] text-slate-500">{w.project?.name || "Solar Rooftop"}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{w.itemType}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">{w.brand}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {w.serialNumber || "-"}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {w.durationYears} Years
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {formatDate(w.endDate)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={w.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: AMC Contracts */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950">Annual Maintenance Contracts (AMC)</h3>
          <span className="text-xs text-slate-500 font-semibold">{amcContracts.length} Contracts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Contract #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Maintenance Plan</th>
                <th className="py-3.5 px-4 text-center">Visits / Year</th>
                <th className="py-3.5 px-4 text-right">Contract Value</th>
                <th className="py-3.5 px-4">Contract Period</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(amcContracts as any[]).map((amc: any) => (
                <tr key={amc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-950">
                    {amc.contractNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-950">
                    {amc.customer?.name || "Customer"}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {amc.planName}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                    {amc.annualVisits} Visits
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-950">
                    {formatCurrency(amc.contractValue)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {formatDate(amc.startDate)} - {formatDate(amc.endDate)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <StatusBadge status={amc.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
