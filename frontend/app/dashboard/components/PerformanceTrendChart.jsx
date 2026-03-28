"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PerformanceTrendChart({ data = [], isLoading = false }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-xl">Performance & Wallet Trend</h3>
          <p className="text-sm text-gray-500 mt-1">
            Last 6 months of win/loss results and successful charges.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[320px] flex items-center justify-center text-sm text-gray-500">
          Loading trend...
        </div>
      ) : (
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                yAxisId="results"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <YAxis
                yAxisId="spend"
                orientation="right"
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={false}
                width={48}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Spend") {
                    return [currencyFormatter.format(Number(value || 0)), name];
                  }

                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="results" dataKey="wins" fill="#16a34a" radius={[6, 6, 0, 0]} name="Wins" />
              <Bar yAxisId="results" dataKey="losses" fill="#dc2626" radius={[6, 6, 0, 0]} name="Losses" />
              <Line
                yAxisId="spend"
                type="monotone"
                dataKey="spend"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Spend"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
