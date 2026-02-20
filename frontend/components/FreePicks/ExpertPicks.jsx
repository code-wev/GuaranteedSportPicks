"use client";

import Image from "next/image";
import { FaFootballBall } from "react-icons/fa";
import { MdSportsBasketball, MdSportsBaseball, MdSportsSoccer, MdSportsHockey, MdOutlineSportsRugby } from "react-icons/md";

const picks = [
  {
    league: "NFL",
    time: "8:20 PM ET",
    title: "Kansas City Chiefs vs Buffalo Bills",
    pick: "Chiefs – 3.5",
    odds: "+125",
    confidence: "High Confidence",
    highlight: "Top Pick",
    description: "Chiefs have dominated at home this season with 7-1 record. Buffalo struggling on the road against top-tier offenses.",
    icon: <MdOutlineSportsRugby />,
  },
  {
    league: "NBA",
    time: "10:00 PM ET",
    title: "Los Angeles Lakers vs Boston Celtics",
    pick: "Chiefs – 3.5",
    odds: "+125",
    confidence: "Medium Confidence",
    highlight: "",
    description: "Both teams average high-scoring games when healthy. Lakers offense has been potent, Celtics offense clicking.",
    icon: <MdSportsBasketball />,
  },
  {
    league: "MLB",
    time: "7:30 PM ET",
    title: "New York Yankees vs Houston Astros",
    pick: "Yankees ML",
    odds: "+125",
    confidence: "High Confidence",
    highlight: "",
    description: "Yankees are stronger on the mound with 2.35 ERA. Astros struggling against left-handed pitching this season.",
    icon: <MdSportsBaseball />,
  },
  {
    league: "Soccer",
    time: "12:20 PM ET",
    title: "Manchester United vs Arsenal",
    pick: "Under 2.5 Goals",
    odds: "-120",
    confidence: "Medium Confidence",
    highlight: "",
    description:
      "Both teams have tightened up defensively. Historic matchups tend to be low-scoring affairs.",
    icon: <MdSportsSoccer/>,
  },
  {
    league: "NBA",
    time: "9:00 PM ET",
    title: "Golden State Warriors vs Phoenix Suns",
    pick: "Warriors +7.5",
    odds: "-110",
    confidence: "High Confidence",
    highlight: "",
    description:
      "Warriors getting healthy at the right time. Suns dealing with key injuries and sluggish from back-to-back games.",
    icon: <MdSportsBasketball />,
  },
  {
    league: "NHL",
    time: "7:20 PM ET",
    title: "Tampa Bay Lightning vs Florida Panthers",
    pick: "Chiefs – 3.5",
    odds: "+125",
    confidence: "Medium Confidence",
    highlight: "",
    description:
      "Chiefs have dominated at home this season with 7-1 record. Buffalo struggling on the road against top-tier offenses.",
    icon: <MdSportsHockey />,
  },
];

export default function ExpertPicks() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">Expert Picks for Today</h1>
        <p className="text-xl">Carefully analyzed selections from our professional handicappers</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {picks.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border-l-4 border-[#B91C1C] p-6 hover:shadow-md transition-all"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
               <p className="w-10 h-10 bg-[#B91C1C] text-xl text-white flex justify-center rounded-full items-center">{item.icon}</p> 
                <p className="font-medium text-sm">{item.league}</p>
              </div>
              <p className="text-gray-400 text-sm">{item.time}</p>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold leading-snug mb-2">{item.title}</h2>

            {/* Pick + Odds */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-xl">{item.pick}</p>
                <p className="text-gray-500 text-sm">Our Pick</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-xl">{item.odds}</p>
                <p className="text-gray-500 text-sm">Odds</p>
              </div>
            </div> 

            {/* Confidence Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${
                  item.confidence === "High Confidence"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.confidence}
              </span>

              {item.highlight && (
                <span className="px-2 py-1 text-xs bg-yellow-300 text-black rounded-full font-semibold">
                  {item.highlight}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
