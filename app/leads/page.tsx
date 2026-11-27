import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Plus, Compass, Search, Phone, MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await db.query.leads.findMany({
    orderBy: [desc(schema.leads.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Leads & Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture solar inquiries, schedule rooftop surveys and track conversion
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          <span>New Lead</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard title="Total Enquiries" value="48" change="+8 this week" isPositive={true} theme="green" iconName="compass" />
        <KPICard title="Site Visits Scheduled" value="14" theme="blue" iconName="calendar" />
        <KPICard title="Proposals Sent" value="19" theme="yellow" iconName="send" />
        <KPICard title="Win Rate" value="64.5%" change="↑ +4.2%" isPositive={true} theme="purple" iconName="percent" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by customer name, location or contact..."
              className="w-full h-9 rounded-lg border border-slate-200 pl-9 pr-3 text-xs focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Lead #</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Est. Capacity</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{lead.leadNumber}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{lead.name}</td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-emerald-600" />
                      {lead.mobile}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {lead.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">{lead.estimatedCapacity} kW</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={lead.status || "New"} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-emerald-700 font-semibold hover:underline flex items-center justify-center gap-1 mx-auto text-xs">
                      <span>Convert</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
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
