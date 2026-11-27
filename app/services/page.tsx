import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const tickets = await db.query.serviceTickets.findMany({
    with: {
      customer: true,
    },
    orderBy: [desc(schema.serviceTickets.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Service & Maintenance
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Annual Maintenance Contracts (AMC), panel cleaning & warranty fault tracking
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          <span>New Service Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard title="Active Service Tickets" value="6" theme="yellow" iconName="wrench" />
        <KPICard title="Resolved This Month" value="28" theme="green" iconName="checkcircle" />
        <KPICard title="Avg Resolution Time" value="24 Hours" theme="blue" iconName="clock" />
        <KPICard title="AMC Renewal Rate" value="94.2%" theme="purple" iconName="percent" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Maintenance & Fault Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Ticket #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Title</th>
                <th className="py-3 px-4">Issue Type</th>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{t.ticketNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{t.customer?.name}</td>
                  <td className="py-3 px-4 text-slate-700">{t.issueTitle}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-700">
                      {t.issueType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-emerald-800">{t.assignedTechnician}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(t.scheduledDate)}</td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={t.status} />
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
