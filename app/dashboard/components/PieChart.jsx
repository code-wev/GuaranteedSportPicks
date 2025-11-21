"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart() {
  const data = {
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ["#16a34a", "#dc2626"], // green and red
        borderColor: "#ffffff", // white gap
        borderWidth: 4, // thickness of the gap
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
      <div className="w-48 h-48 mx-auto">
        <Doughnut data={data} options={options} />
      </div>

      {/* Custom legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-600"></span> Losses
        </div>
        <div className="flex items-center gap-2"> 
          <span className="w-4 h-4 bg-green-600"></span> Wins
        </div>
      </div>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-green-600 rounded-full"></span> Wins (65%)
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-600 rounded-full"></span> Losses (35%)
        </div>
      </div>
    </div>
  );
}
