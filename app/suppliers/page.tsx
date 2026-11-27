import React from "react";
import { db, schema } from "@/db";
import { KPICard } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/utils";
import { Building2, Plus, Phone, Mail, MapPin, Truck, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await db.query.suppliers.findMany();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            OEM Vendors & Suppliers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Authorized Tier-1 solar panel, inverter and mounting hardware suppliers
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Registered Suppliers"
          value={suppliers.length || 3}
          theme="green"
          iconName="building"
          subtext="Tier-1 manufacturers"
        />
        <KPICard
          title="Active Procurement"
          value="₹ 48,20,000"
          theme="blue"
          iconName="rupee"
          subtext="FY 24-25 orders"
        />
        <KPICard
          title="Avg. Lead Time"
          value="7 Days"
          theme="yellow"
          iconName="clock"
          subtext="Factory dispatch"
        />
        <KPICard
          title="Credit Terms"
          value="30 - 45 Days"
          theme="emerald"
          iconName="check"
          subtext="Negotiated credit line"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(suppliers as any[]).map((sup: any) => (
          <div
            key={sup.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                  {sup.supplierCode}
                </span>
                <h3 className="text-lg font-bold text-slate-950 mt-1">
                  {sup.name}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Authorized OEM
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-slate-900">{sup.phone}</span>
                <span className="text-slate-500">({sup.contactPerson})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">{sup.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">{sup.address ? `${sup.address}, ${sup.city}, ${sup.state}` : `${sup.city}, ${sup.state}`}</span>
              </div>
            </div>

            {/* GSTIN & Terms */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">GSTIN</span>
                <span className="font-mono font-bold text-slate-900">{sup.gstin}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Payment Terms</span>
                <span className="font-bold text-emerald-700">{sup.paymentTerms}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
                Create Purchase Order →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
