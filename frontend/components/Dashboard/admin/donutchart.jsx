"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#22C55E", "#E5E7EB"]; // green + gray

export default function DonutChart({ wins = 0, losses = 0, isLoading = false }) {
  const total = wins + losses;
  const data = total
    ? [
        { name: "Wins", value: wins },
        { name: "Losses", value: losses },
      ]
    : [
        { name: "Wins", value: 1 },
        { name: "Losses", value: 1 },
      ];
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const lossRate = total ? Math.round((losses / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Win vs Loss Ratio</h2>

      {isLoading ? (
        <div className="h-56 flex items-center justify-center text-sm text-gray-500">
          Loading ratio...
        </div>
      ) : (
        <>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
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

          <div className="flex justify-center">
            <p className="text-xs font-medium text-emerald-600">
              Wins: {winRate}% &nbsp; | &nbsp;
              <span className="text-gray-500">Losses: {lossRate}%</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
