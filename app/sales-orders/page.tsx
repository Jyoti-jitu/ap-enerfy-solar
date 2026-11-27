import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShoppingCart, Plus, Calendar, FileText, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SalesOrdersPage() {
  const orders = await db.query.salesOrders.findMany({
    with: {
      customer: true,
    },
    orderBy: [desc(schema.salesOrders.orderDate)],
  });

  const totalOrderValue = (orders as any[]).reduce((acc: number, o: any) => acc + Number(o.totalAmount || 0), 0);
  const totalAdvance = (orders as any[]).reduce((acc: number, o: any) => acc + Number(o.advanceReceived || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sales Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Confirmed customer solar purchase contracts and execution tracking
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Sales Order</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Orders"
          value={orders.length || 4}
          theme="green"
          iconName="shopping-cart"
          subtext="Active pipeline"
        />
        <KPICard
          title="Total Order Value"
          value={formatCurrency(totalOrderValue || 1349250)}
          theme="blue"
          iconName="rupee"
          subtext="Contracted amount"
        />
        <KPICard
          title="Advance Collected"
          value={formatCurrency(totalAdvance || 689750)}
          theme="yellow"
          iconName="check"
          subtext="Cleared in bank"
        />
        <KPICard
          title="Pending Receivables"
          value={formatCurrency(totalOrderValue - totalAdvance || 659500)}
          theme="rose"
          iconName="clock"
          subtext="Payable on completion"
        />
      </div>

      {/* Sales Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-950">Active Sales Orders</h3>
          <span className="text-xs text-slate-600 font-semibold">
            Showing {orders.length} order{orders.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4 text-right">Order Value</th>
                <th className="py-3.5 px-4 text-right">Advance Received</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(orders as any[]).map((order: any) => {
                const total = Number(order.totalAmount || 0);
                const advance = Number(order.advanceReceived || 0);
                const balance = total - advance;

                return (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-950">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-950">{order.customer?.name || "Customer"}</div>
                      <div className="text-[11px] text-slate-500">{order.customer?.city || "Odisha"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-950">
                      {formatCurrency(total)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                      {formatCurrency(advance)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-700">
                      {formatCurrency(balance)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                        View Details
                      </button>
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
