"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ wins = 0, losses = 0, isLoading = false }) {
  const total = wins + losses;
  const safeWins = total > 0 ? wins : 1;
  const safeLosses = total > 0 ? losses : 1;
  const winPercent = total > 0 ? Math.round((wins / total) * 100) : 0;
  const lossPercent = total > 0 ? Math.round((losses / total) * 100) : 0;

  const data = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [safeWins, safeLosses],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderColor: "#ffffff",
        borderWidth: 4,
        cutout: "70%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
      <h3 className="font-semibold mb-4 text-start text-xl">Win vs Lost Ratio</h3>
      {isLoading ? (
        <div className="h-[272px] flex items-center justify-center text-sm text-gray-500">
          Loading ratio...
        </div>
      ) : (
        <>
          <div className="w-48 h-48 mx-auto">
            <Doughnut data={data} options={options} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl border border-green-100 bg-green-50 p-4">
              <p className="text-xs uppercase tracking-wide text-green-700 font-semibold">Wins</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{wins}</p>
              <p className="text-sm text-green-600 mt-1">{winPercent}% of graded picks</p>
            </div>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-xs uppercase tracking-wide text-red-700 font-semibold">Losses</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{losses}</p>
              <p className="text-sm text-red-600 mt-1">{lossPercent}% of graded picks</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
