"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function DailySalesChart({ data = [], isLoading = false }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Daily Sales</h2>

      {isLoading ? (
        <div className="h-56 flex items-center justify-center text-sm text-gray-500">
          Loading sales...
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value || 0).toFixed(2)}`, "Sales"]} />
              <Bar dataKey="sales" fill="#E53935" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default DailySalesChart;
