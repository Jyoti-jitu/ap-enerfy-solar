"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR } from "@/lib/formatting";

export interface RevenueDataPoint {
  month: string;
  billing: number;
  collection?: number;
}

const DEFAULT_DATA: RevenueDataPoint[] = [
  { month: "Aug", billing: 850000, collection: 700000 },
  { month: "Sep", billing: 1200000, collection: 1050000 },
  { month: "Oct", billing: 1450000, collection: 1300000 },
  { month: "Nov", billing: 1780000, collection: 1600000 },
  { month: "Dec", billing: 2150000, collection: 1950000 },
  { month: "Jan", billing: 2480000, collection: 2040000 },
];

export function RevenueTrendChart({
  data = DEFAULT_DATA,
  height = 240,
}: {
  data?: RevenueDataPoint[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16834B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#16834B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748B", fontSize: 11 }}
            tickFormatter={(val) => {
              if (val >= 100000) return `${val / 100000}L`;
              if (val >= 1000) return `${val / 1000}k`;
              return String(val);
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as RevenueDataPoint;
                return (
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 text-xs">
                    <p className="font-bold text-slate-800 mb-1">{item.month} 2025</p>
                    <p className="text-emerald-700 font-semibold flex items-center justify-between gap-3">
                      <span>Monthly Billing:</span>
                      <span className="tabular-nums">{formatINR(item.billing)}</span>
                    </p>
                    {item.collection && (
                      <p className="text-blue-700 font-semibold flex items-center justify-between gap-3 mt-0.5">
                        <span>Collections:</span>
                        <span className="tabular-nums">{formatINR(item.collection)}</span>
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="billing"
            stroke="#16834B"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#billingGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
