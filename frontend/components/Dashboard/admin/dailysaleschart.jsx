"use client";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Mon", sales: 9000 },
  { day: "Tue", sales: 5500 },
  { day: "Wed", sales: 7400 },
  { day: "Thurs", sales: 9100 },
  { day: "Fri", sales: 7100 },
  { day: "Sat", sales: 7690 },
  { day: "Sun", sales: 5100 },
];

function DailySalesChart() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Daily Sales</h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis ticks={[0, 2500, 5000, 7500, 10000]} />
            <Tooltip />
            <Bar dataKey="sales" fill="#E53935" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DailySalesChart;
