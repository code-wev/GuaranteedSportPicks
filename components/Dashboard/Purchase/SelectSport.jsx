"use client";

import {
  FaFootballBall,
  FaBasketballBall,
  FaBaseballBall,
} from "react-icons/fa";
import { GiHockey } from "react-icons/gi";
import { IoBaseballOutline } from "react-icons/io5";

export default function SelectSport() {
  const sports = [
    { name: "NFL", icon: <FaFootballBall size={22} /> },
    { name: "NBA", icon: <FaBasketballBall size={22} /> },
    { name: "MLB", icon: <IoBaseballOutline size={22} /> },
    { name: "NHL", icon: <GiHockey size={22} /> },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-lg font-medium mb-4">Select Sport</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {sports.map((sport) => (
          <button
            key={sport.name}
            className={`border border-gray-100 rounded-xl py-4 text-sm font-medium flex flex-col items-center gap-3 ${
              sport.name === "NFL"
                ? "bg-red-50 border-red-300 text-[#B91C1C]"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{sport.icon}</span>
            {sport.name}
          </button>
        ))}
      </div>
    </div>
  );
}
