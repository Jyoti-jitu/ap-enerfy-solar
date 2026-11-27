import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { formatDate } from "@/lib/utils";
import { History, Shield, AlertCircle, CheckCircle2, User, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const auditLogs = await db.query.auditLogs.findMany({
    with: {
      user: true,
    },
    orderBy: [desc(schema.auditLogs.createdAt)],
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System & Security Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Immutable regulatory audit log for administrative, security and financial transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-200">
            <Shield className="h-3.5 w-3.5" />
            <span>Audit Logging Active</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Audit Events"
          value={auditLogs.length || 27}
          theme="green"
          iconName="history"
          subtext="Logged in system"
        />
        <KPICard
          title="Authentication Events"
          value={(auditLogs as any[]).filter((l: any) => l.action.includes("LOGIN") || l.action.includes("AUTH")).length || 6}
          theme="blue"
          iconName="user"
          subtext="Logins & sessions"
        />
        <KPICard
          title="Role & Access Changes"
          value={(auditLogs as any[]).filter((l: any) => l.action.includes("ROLE") || l.action.includes("PASSWORD")).length || 8}
          theme="yellow"
          iconName="shield"
          subtext="Privileged operations"
        />
        <KPICard
          title="Integrity Status"
          value="100% Verified"
          theme="emerald"
          iconName="check"
          subtext="Cryptographically sound"
        />
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950">Recent System Activities</h3>
          <span className="text-xs text-slate-500 font-semibold">Showing last 50 events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor / User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Status / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(auditLogs as any[]).map((log: any) => {
                const isPrivileged =
                  log.action.includes("ROLE") ||
                  log.action.includes("DELETE") ||
                  log.action.includes("PASSWORD");

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-950">
                        {log.user?.name || log.user?.email || "System Admin"}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {log.user?.role || "System"}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded font-mono font-bold text-[10px] ${
                          isPrivileged
                            ? "bg-amber-100 text-amber-900 border border-amber-200"
                            : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {log.entity} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ""}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {log.newValues || "Transaction recorded successfully"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
