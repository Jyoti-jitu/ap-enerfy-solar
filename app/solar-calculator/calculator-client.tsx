"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KPICard } from "@/components/shared/kpi-card";
import { formatCurrency } from "@/lib/utils";
import {
  Sun,
  Calculator,
  Zap,
  Leaf,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Home,
  Building,
} from "lucide-react";

export function SolarCalculatorClient() {
  const [monthlyBill, setMonthlyBill] = useState<number>(3500);
  const [roofArea, setRoofArea] = useState<number>(350);
  const [category, setCategory] = useState<"residential" | "commercial">("residential");

  // Calculations
  // Electricity tariff approx ₹6.00 / unit in Odisha (TPCODL)
  const tariffPerUnit = category === "residential" ? 5.8 : 7.5;
  const estimatedUnitsPerMonth = Math.round(monthlyBill / tariffPerUnit);
  const dailyUnitsRequired = estimatedUnitsPerMonth / 30;

  // Approx 4.2 peak solar hours per day in Odisha
  const rawCapacity = dailyUnitsRequired / 4.2;
  // Area constraint: ~100 sq ft per kW
  const maxCapacityByArea = roofArea / 100;

  // Round capacity to nearest 0.5 kW, minimum 1 kW, max 25 kW
  const recommendedKw = Math.min(
    Math.max(1, Math.round(Math.min(rawCapacity, maxCapacityByArea) * 2) / 2),
    25
  );

  // Panels: 540W Mono PERC
  const panelCount = Math.ceil((recommendedKw * 1000) / 540);
  const monthlyGeneration = Math.round(recommendedKw * 4.2 * 30);
  const annualSavings = Math.round(monthlyGeneration * tariffPerUnit * 12);

  // PM Surya Ghar Central Subsidy
  let subsidy = 0;
  if (category === "residential") {
    if (recommendedKw >= 3) {
      subsidy = 78000;
    } else if (recommendedKw >= 2) {
      subsidy = 60000;
    } else if (recommendedKw >= 1) {
      subsidy = 30000;
    }
  }

  // Cost estimates: ~₹55,000 / kW turn-key (including GST & net meter)
  const estimatedGrossCost = Math.round(recommendedKw * 55000 * 1.05);
  const netPayableCost = Math.max(0, estimatedGrossCost - subsidy);
  const paybackYears = (netPayableCost / (annualSavings || 1)).toFixed(1);
  const lifetime25YrSavings = annualSavings * 25 - netPayableCost;
  const co2Tons25Yr = Math.round((monthlyGeneration * 12 * 25 * 0.82) / 1000);

  return (
    <div className="space-y-6">
      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Recommended System"
          value={`${recommendedKw} kW`}
          theme="green"
          iconName="sun"
          subtext={`${panelCount}x 540W Mono PERC Panels`}
        />
        <KPICard
          title="PM Surya Ghar Subsidy"
          value={category === "residential" ? formatCurrency(subsidy) : "₹ 0 (Commercial)"}
          theme="yellow"
          iconName="zap"
          subtext="Direct DB Transfer"
        />
        <KPICard
          title="Net Customer Investment"
          value={formatCurrency(netPayableCost)}
          theme="blue"
          iconName="rupee"
          subtext={`Gross: ${formatCurrency(estimatedGrossCost)}`}
        />
        <KPICard
          title="Estimated Payback"
          value={`${paybackYears} Years`}
          theme="emerald"
          iconName="trending"
          subtext="25-Year System Life"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calculator Controls */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              <span>Project Sizing Parameters</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Odisha Tariff v2025</span>
          </div>

          {/* Customer Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Premises Type & Subsidy Scheme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCategory("residential")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  category === "residential"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Home className="h-4 w-4 text-emerald-600" />
                <span>Residential (PM Surya Ghar)</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("commercial")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  category === "commercial"
                    ? "bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Building className="h-4 w-4 text-emerald-600" />
                <span>Commercial / Industrial</span>
              </button>
            </div>
          </div>

          {/* Slider 1: Monthly Electricity Bill */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">Average Monthly Electricity Bill</label>
              <span className="font-mono font-extrabold text-base text-emerald-700">
                ₹ {monthlyBill.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={800}
              max={25000}
              step={200}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
              <span>₹ 800</span>
              <span>~{estimatedUnitsPerMonth} kWh / Month</span>
              <span>₹ 25,000</span>
            </div>
          </div>

          {/* Slider 2: Available Roof Area */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">Available Shadow-Free Rooftop Area</label>
              <span className="font-mono font-extrabold text-base text-slate-900">
                {roofArea} sq. ft.
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2500}
              step={50}
              value={roofArea}
              onChange={(e) => setRoofArea(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
              <span>100 sq ft (1 kW)</span>
              <span>Capacity Cap: ~{Math.floor(roofArea / 100)} kW</span>
              <span>2500+ sq ft</span>
            </div>
          </div>

          {/* Quick Specifications Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Estimated Monthly Solar Generation:</span>
              <strong className="text-slate-950 font-bold">~{monthlyGeneration} Units (kWh)</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Estimated Annual Electricity Savings:</span>
              <strong className="text-emerald-700 font-bold">₹ {annualSavings.toLocaleString("en-IN")} / Year</strong>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Roof Area Required:</span>
              <strong className="text-slate-950 font-bold">{recommendedKw * 95} sq. ft.</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Environmental ROI Summary */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-950 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <span>Financial & Environmental Returns</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ROI {paybackYears} Yrs
              </span>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-semibold text-slate-700">Estimated Project Cost (Turn-key)</span>
                <span className="text-sm font-extrabold text-slate-950">{formatCurrency(estimatedGrossCost)}</span>
              </div>

              {category === "residential" && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900">
                  <div>
                    <span className="text-xs font-bold block">PM Surya Ghar Subsidy Benefit</span>
                    <span className="text-[11px] text-amber-700">Direct DBT to bank account</span>
                  </div>
                  <span className="text-base font-extrabold text-amber-800">
                    - {formatCurrency(subsidy)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div>
                  <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider block">
                    Net Payable Investment
                  </span>
                  <span className="text-[11px] text-emerald-700">Including Structure, Inverter, Panels & Net Meter</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-900">
                  {formatCurrency(netPayableCost)}
                </span>
              </div>
            </div>

            {/* Lifetime 25-Year Projection */}
            <div className="mt-5 p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                25-Year Performance & Environmental Impact
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">
                    Lifetime Net Savings
                  </span>
                  <span className="text-base font-extrabold text-emerald-700">
                    ₹ {Math.max(0, lifetime25YrSavings).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block flex items-center gap-1">
                    <Leaf className="h-3 w-3 text-emerald-600" />
                    <span>CO2 Reduction</span>
                  </span>
                  <span className="text-base font-extrabold text-slate-900">
                    ~{co2Tons25Yr} Metric Tons
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Link to Create Quotation */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <Link
              href="/quotations"
              className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Generate Official Quotation for {recommendedKw} kW</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
