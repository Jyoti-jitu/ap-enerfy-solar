import React from "react";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { KPICard } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/utils";
import {
  SunMedium,
  Plus,
  Zap,
  CheckCircle2,
  ShieldCheck,
  Battery,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SolarPackagesPage() {
  const packages = await db.query.solarPackages.findMany({
    orderBy: [desc(schema.solarPackages.capacityKw)],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Solar Packages & Systems
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pre-engineered residential rooftop, commercial and hybrid solar kits for Odisha
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Solar Package</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Solar Packages"
          value={packages.length || 5}
          theme="green"
          iconName="sun"
          subtext="Rooftop, Hybrid & Agro"
        />
        <KPICard
          title="PM Surya Ghar Eligible"
          value={(packages as any[]).filter((p: any) => p.subsidyApplicable).length || 3}
          theme="yellow"
          iconName="zap"
          subtext="Up to ₹78,000 subsidy"
        />
        <KPICard
          title="Avg. Residential Cost"
          value="₹ 1,73,250"
          theme="blue"
          iconName="rupee"
          subtext="3 kW On-Grid standard"
        />
        <KPICard
          title="Avg. Daily Yield"
          value="18.5 kWh"
          theme="emerald"
          iconName="trending"
          subtext="4.2 peak sun hours"
        />
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(packages as any[]).map((pkg: any) => {
          const isHybrid = pkg.systemType === "Hybrid";
          const hasSubsidy = pkg.subsidyApplicable;

          return (
            <div
              key={pkg.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  isHybrid
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600"
                }`}
              />

              <div>
                {/* Header Badge & Code */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase">
                    {pkg.code}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isHybrid
                        ? "bg-purple-100 text-purple-900 border border-purple-200"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}
                  >
                    {pkg.systemType}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-950 mb-1 group-hover:text-emerald-700 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                  {pkg.description || "Complete turn-key solar package with tier-1 equipment and net metering."}
                </p>

                {/* Key Technical Specs */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Capacity
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {pkg.capacityKw} kW
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Daily Generation
                    </span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ~{pkg.estimatedGenerationKwhPerDay} Units
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Annual Savings
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹ {Number(pkg.estimatedAnnualSavings || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">
                      Govt Subsidy
                    </span>
                    <span className="font-bold text-amber-700">
                      {hasSubsidy ? `₹ ${Number(pkg.estimatedSubsidyAmount || 0).toLocaleString("en-IN")}` : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Features Included */}
                <div className="space-y-1.5 mb-4 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Tier-1 Topcon / Mono PERC Solar Panels</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>High-Efficiency Smart Solar Inverter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>HDG Structure, DC/ACDB, Earthing & Lightning Arrester</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                    <span>TPCODL Net Metering & PM Surya Ghar Processing</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Footer */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Turnkey Price (Inc. GST)
                    </span>
                    <div className="text-xl font-extrabold text-slate-950">
                      {formatCurrency(pkg.totalPrice)}
                    </div>
                  </div>
                  {hasSubsidy && (
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Net: {formatCurrency(Number(pkg.totalPrice) - Number(pkg.estimatedSubsidyAmount || 0))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5">
                    <span>Create Quotation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
