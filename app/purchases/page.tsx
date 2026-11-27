import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Plus, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PurchasesPage() {
  const purchaseOrders = await db.query.purchaseOrders.findMany({
    with: {
      supplier: true,
    },
    orderBy: [desc(schema.purchaseOrders.createdAt)],
  });

  const suppliers = await db.select().from(schema.suppliers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Purchase & Suppliers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Procurement for solar panels, inverters, structures and cables
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard title="Total POs Issued" value="42" change="+6 this month" isPositive={true} theme="green" iconName="truck" />
        <KPICard title="Total Procurement" value="₹ 48,20,000" theme="blue" iconName="rupee" />
        <KPICard title="Registered OEM Vendors" value="8" theme="yellow" iconName="building" />
        <KPICard title="Pending Deliveries" value="3" theme="rose" iconName="clock" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-3">Key Solar Suppliers</h3>
          <div className="space-y-3">
            {suppliers.map((sup: any) => (
              <div key={sup.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900">{sup.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{sup.supplierCode}</span>
                </div>
                <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  {sup.phone} · {sup.contactPerson}
                </p>
                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>GSTIN: {sup.gstin}</span>
                  <span className="font-semibold text-emerald-700">{sup.paymentTerms}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Recent Purchase Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4">PO Date</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po: any) => (
                  <tr key={po.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">{po.poNumber}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{po.supplier?.name}</td>
                    <td className="py-3 px-4 text-slate-600">{formatDate(po.poDate)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(po.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={po.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
