"use client";

import { FaCheck } from "react-icons/fa";
import Image from "next/image";

export default function Package() {
  return (
    <section className="relative w-full bg-[#fff6f6] py-20 text-center">
      {/* Ripple background */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2">
        <Image
          src="/home/package/chakti2.png"
          alt="Ripple"
          width={1188}
          height={180}
        />
      </div>

      <h2 className="text-[32px] font-extrabold text-black">
        Choose Your Winning Package
      </h2>
      <p className="text-gray-600 mt-3 mb-14 max-w-xl mx-auto text-sm">
        From casual bettors to professional gamblers, we have the perfect plan
        for your success
      </p>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Starter */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col">
          <h3 className="text-lg font-bold">Starter</h3>

          <p className="mt-6">
            <span className="text-4xl font-extrabold text-[#e53935]">$49</span>
            <span className="text-sm font-medium text-gray-500"> / week</span>
          </p>

          <p className="text-sm font-medium text-gray-500 mt-1">
            Perfect for casual bettors
          </p>

          <hr className="my-6" />

          <ul className="space-y-3 text-sm text-gray-700 flex-1 text-left">
            {[
              "3–5 Daily Picks",
              "Basic Analysis",
              "Email Support",
              "Mobile Access",
              "Win/Loss Tracking",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <FaCheck className="text-green-500 mt-1" />
                {item}
              </li>
            ))}
          </ul>

          <button className="mt-8 bg-[#c62828] text-white py-3 rounded-full font-semibold hover:bg-red-700 transition">
            Get Started
          </button>
        </div>

        {/* Pro */}
        <div className="relative bg-[#c01818] text-white rounded-2xl shadow-2xl p-8 flex flex-col scale-[1.03]">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>

          <h3 className="text-lg font-bold">Pro</h3>

          <p className="mt-6">
            <span className="text-4xl font-extrabold">$149</span>
            <span className="text-sm font-medium opacity-80"> / month</span>
          </p>

          <p className="text-sm font-medium text-white/80 mt-1">Most popular choice</p>

          <hr className="my-6 border-white/20" />

          <ul className="space-y-3 text-sm flex-1 text-left">
            {[
              "12 Daily Picks",
              "Detailed Analysis",
              "Priority Support",
              "Live Chat Access",
              "Advanced Statistics",
              "Injury Reports",
              "Weather Analysis",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <FaCheck className="text-white mt-1" />
                {item}
              </li>
            ))}
          </ul>

          <button className="mt-8 bg-white text-[#c01818] py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>

        {/* VIP */}
        <div className="relative bg-white rounded-2xl shadow-xl p-8 flex flex-col">
          <span className="absolute -top-4 right-6 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Save 40%
          </span>

          <h3 className="text-lg font-bold">VIP</h3>

          <p className="mt-6">
            <span className="text-4xl font-extrabold text-[#e53935]">$399</span>
            <span className="text-sm font-medium text-gray-500">/ 3 month</span>
          </p>

          <p className="text-sm font-medium text-gray-500 mt-1">For serious bettors</p>

          <hr className="my-6" />

          <ul className="space-y-3 text-sm text-gray-700 flex-1 text-left">
            {[
              "Unlimited Daily Picks",
              "Expert Analysis",
              "Phone Support",
              "Personal Account Manager",
              "Exclusive VIP Picks",
              "Live Game Updates",
              "Custom Betting Strategies",
              "Money Management Guide",
            ].map((item) => (
              <li key={item} className="flex gap-2 items-start">
                <FaCheck className="text-green-500 mt-1" />
                {item}
              </li>
            ))}
          </ul>

          <button className="mt-8 bg-[#c62828] text-white py-3 rounded-full font-semibold hover:bg-red-700 transition">
            Get Started
          </button>
        </div>
      </div>

      <div className="mt-20">
        <button className="bg-[#e53935] text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700 transition">
          Experience our Packages
        </button>
      </div>
    </section>
  );
}
