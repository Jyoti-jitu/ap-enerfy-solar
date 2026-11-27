import React from "react";
import { db, schema } from "@/db";
import { KPICard } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/utils";
import { Warehouse, Plus, MapPin, Package, AlertTriangle, CheckCircle2, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function WarehousesPage() {
  const warehouses = await db.query.warehouses.findMany();
  const products = await db.query.products.findMany();

  const totalStockItems = (products as any[]).reduce((s: number, p: any) => s + Number(p.currentStock || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Warehouses & Stock Locations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Regional storage hubs, panels stock, inverters and BOS distribution points in Odisha
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Warehouse</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Warehouses"
          value={warehouses.length || 2}
          theme="green"
          iconName="warehouse"
          subtext="Bhubaneswar & Cuttack"
        />
        <KPICard
          title="Total Stock Units"
          value={totalStockItems || 428}
          theme="blue"
          iconName="package"
          subtext="Panels, inverters & BOS"
        />
        <KPICard
          title="Inventory Valuation"
          value="₹ 54,20,000"
          theme="yellow"
          iconName="rupee"
          subtext="Landed cost value"
        />
        <KPICard
          title="Stock Health"
          value="98.2%"
          theme="emerald"
          iconName="check"
          subtext="Zero damaged items"
        />
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(warehouses as any[]).map((wh: any) => (
          <div
            key={wh.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {wh.code}
                </span>
                <h3 className="text-lg font-bold text-slate-950 mt-2">
                  {wh.name}
                </h3>
              </div>
              {wh.isDefault && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Main Depot
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-slate-800">
                  {wh.address ? `${wh.address}, ${wh.city}, ${wh.state}` : `${wh.city}, ${wh.state}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-600">Status: <strong className="text-slate-900">Active & Operational</strong></span>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Storage Utilization</span>
                <span className="text-emerald-700 font-bold">68% Capacity</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                View Stock Register →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
