"use client";

import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

export function SparklineChart({
  data,
  color = "#16834B",
  height = 32,
  width = 70,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const chartData = data.map((val, i) => ({ i, val }));

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Area
            type="monotone"
            dataKey="val"
            stroke={color}
            strokeWidth={1.5}
            fill={color}
            fillOpacity={0.15}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
