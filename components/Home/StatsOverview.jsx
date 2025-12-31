"use client";

import { FaChartLine, FaMedal, FaStar, FaBolt } from "react-icons/fa";

const stats = [
  {
    icon: FaChartLine,
    value: "250+",
    label: "Daily Picks",
  },
  {
    icon: FaMedal,
    value: "85%",
    label: "Win Rate",
  },
  {
    icon: FaStar,
    value: "15",
    label: "Sports Covered",
  },
  {
    icon: FaBolt,
    value: "24/7",
    label: "Live Updates",
  },
];

export default function StatsOverview() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-b border-[#F1F1F1]">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center py-10
                  ${index !== stats.length - 1 ? "md:border-r border-[#F1F1F1]" : ""}
                `}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-[#FFECEC] flex items-center justify-center mb-4">
                  <Icon className="text-[#E11D2E] text-[18px]" />
                </div>

                {/* Value */}
                <div className="text-[22px] font-bold text-[#111827] leading-none mb-1">
                  {item.value}
                </div>

                {/* Label */}
                <div className="text-[13px] text-[#6B7280]">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
