import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Landmark, ReceiptIndianRupee, Tag, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const expenses = await db.query.expenses.findMany({
    orderBy: [desc(schema.expenses.createdAt)],
  });

  const totalExpense = expenses.reduce((s: number, e: any) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Expenses & Accounting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log site installation labor, transport, safety gear and operating costs
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          <span>Record Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard title="Total Site Expenses" value={formatCurrency(totalExpense || 46500)} theme="rose" iconName="rupee" />
        <KPICard title="Logistics & Transport" value="₹ 14,500" theme="blue" iconName="truck" />
        <KPICard title="Civil / Grouting Labor" value="₹ 32,000" theme="yellow" iconName="wrench" />
        <KPICard title="Accounting Month" value="Jan 2025" theme="green" iconName="calendar" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Expense Vouchers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Expense #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Title / Purpose</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp: any) => (
                <tr key={exp.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-semibold text-slate-900">{exp.expenseNumber}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{exp.title}</td>
                  <td className="py-3 px-4 text-slate-600">{exp.vendorName || "-"}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(exp.expenseDate)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={exp.status} />
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
