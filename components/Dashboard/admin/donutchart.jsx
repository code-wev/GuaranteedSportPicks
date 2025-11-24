"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Wins", value: 68 },
  { name: "Losses", value: 32 },
];

const colors = ["#22C55E", "#E5E7EB"]; // green + gray

export default function DonutChart() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Top Sports</h2>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />

            {/* Donut Chart */}
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              cornerRadius={12}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Center Label */}
      <div className="flex justify-center">
        <p className="text-xs font-medium text-emerald-600">
          Wins: 68% &nbsp; | &nbsp;
          <span className="text-gray-500">Losses: 32%</span>
        </p>
      </div>
    </div>
  );
}
