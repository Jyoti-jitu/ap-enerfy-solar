import React from "react";
import { SolarCalculatorClient } from "./calculator-client";

export const metadata = {
  title: "Solar Rooftop & Subsidy Calculator - AP Enerfy Solar",
  description: "Calculate solar capacity, estimated generation, PM Surya Ghar subsidy and 25-year financial savings.",
};

export default function SolarCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Solar System & Subsidy Calculator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          PM Surya Ghar Muft Bijli Yojana rooftop sizing, financial return and payback estimation
        </p>
      </div>

      <SolarCalculatorClient />
    </div>
  );
}
