"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { formatINR } from "@/lib/formatting";

export interface CategoryDataPoint {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

const DEFAULT_CATEGORY_DATA: CategoryDataPoint[] = [
  { name: "Solar Panels", value: 958000, color: "#2563EB", percentage: 38.5 },
  { name: "Inverters", value: 714000, color: "#16834B", percentage: 28.7 },
  { name: "Batteries", value: 403000, color: "#F4B740", percentage: 16.2 },
  { name: "Others / Accessories", value: 412000, color: "#8B5CF6", percentage: 16.6 },
];

export function CategoryDistributionChart({
  data = DEFAULT_CATEGORY_DATA,
  height = 220,
  innerRadius = 55,
  outerRadius = 78,
  totalLabel = "Total Sales",
}: {
  data?: CategoryDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  totalLabel?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4" style={{ height }}>
      {/* Donut Chart with Centered Total */}
      <div className="relative w-44 h-44 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as CategoryDataPoint;
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-md p-2 text-xs">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="text-slate-600 mt-0.5">
                        {formatINR(item.value)} ({item.percentage || ((item.value / total) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-bold text-slate-800 leading-tight">
            {formatINR(total, { compact: true })}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">{totalLabel}</span>
        </div>
      </div>

      {/* Legend Column */}
      <div className="space-y-1.5 flex-1 min-w-[120px]">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 truncate font-medium">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-900 tabular-nums text-[11px]">
              {item.percentage ? `${item.percentage}%` : `${((item.value / total) * 100).toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
