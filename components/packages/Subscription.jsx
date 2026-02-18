// components/Subscription.jsx
"use client";

import React from "react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { SlEarphonesAlt } from "react-icons/sl";
import { TfiReload } from "react-icons/tfi";

const Subscription = () => {
  return (
    <div className="py-16 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Subscription Packages</h2>
      <p className="text-gray-500 mb-20">
        Choose the perfect plan for your betting success
      </p>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl px-4">
        {/* ----------------------------- STARTER PLAN ----------------------------- */}
        <div
          className="relative flex-1 rounded-2xl shadow-lg p-8 flex flex-col bg-white 
          transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
        >
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium mb-2">Starter</h3>
            <p className="text-4xl font-bold mb-2 flex items-center gap-1 text-[#B91C1C]">
              $49{" "}
              <span className=" text-lg font-bold text-[#4B556C]">/week</span>
            </p>
            <p className="mb-6 text-sm text-[#4B556C] font-bold">
              Perfect for casual bettors
            </p>
          </div>

          <ul className="mb-6 flex-1 space-y-2">
            {[
              "3-5 Daily Picks",
              "Basic Analysis",
              "Email Support",
              "Mobile Access",
              "Win/Loss Tracking",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className="mt-auto py-3 px-6 rounded-xl font-medium shadow bg-[#B91C1C] text-white hover:opacity-90 transition">
            Get Started
          </button>
        </div>

        {/* ----------------------------- PRO PLAN (HIGHLIGHTED) ----------------------------- */}
        <div
          className="relative flex-1 rounded-xl shadow-xl p-10 flex flex-col bg-[#B91C1C] text-white
  min-h-[520px] lg:min-h-[560px]
  scale-105
  transition-all duration-300 hover:scale-[1.14] hover:shadow-2xl hover:-translate-y-2"
        >
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F5E104] text-black px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>

          <span className="absolute -top-4 right-0 bg-[#26AB68] text-white px-2 py-1 rounded-full text-xs font-medium">
            Save 25%
          </span>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-3">Pro</h3>
            <p className="text-4xl font-bold mb-2 flex items-center gap-1">
              $149 <span className="text-lg font-normal">/month</span>
            </p>
            <p className="mb-6 text-sm font-bold">Most popular choice</p>
          </div>

          <ul className="mb-6 flex-1 space-y-2">
            {[
              "12 Daily Picks",
              "Detailed Analysis",
              "Priority Support",
              "Live Chat Access",
              "Advanced Statistics",
              "Injury Reports",
              "Weather Analysis",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className="mt-auto py-3 px-6 rounded-xl font-bold shadow bg-white text-[#B91C1C] hover:opacity-90 transition">
            Get Started
          </button>
        </div>

        {/* ----------------------------- VIP PLAN ----------------------------- */}
        <div
          className="relative flex-1 rounded-xl shadow-2xl p-8 flex flex-col bg-white
          transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
        >
          <span className="absolute -top-4 right-0 bg-[#26AB68] text-white px-3 py-1 rounded-full text-sm font-medium">
            Save 40%
          </span>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold mb-2">VIP</h3>
            <p className="text-4xl font-bold mb-2 flex items-center gap-1 text-[#B91C1C]">
              $399 <span className="text-lg text-[#4B556C]">/3 month</span>
            </p>
            <p className="mb-6 text-sm text-[#4B556C] font-bold">
              For serious bettors
            </p>
          </div>

          <ul className="mb-6 flex-1 space-y-2">
            {[
              "Unlimited Daily Picks",
              "Expert Analysis",
              "Phone Support",
              "Personal Account Manager",
              "Exclusive VIP Picks",
              "Live Game Updates",
              "Custom Betting Strategies",
              "Money Management Guide",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button className="mt-auto py-3 px-6 rounded-xl font-medium shadow bg-[#B91C1C] text-white hover:opacity-90 transition">
            Get Started
          </button>
        </div>
      </div>

      <p className="mt-10 text-gray-400 text-sm">
        All packages include our 7-day money-back guarantee
      </p>

      <div className="mt-2 flex items-center gap-6 text-[#4B556C] text-sm">
        <span className="flex items-center gap-1">
          <IoShieldCheckmarkOutline />
          Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <TfiReload />
          Cancel Anytime
        </span>
        <span>Cancel Anytime</span>
        <span className="flex items-center gap-1">
          <SlEarphonesAlt />
          24/7 Support
        </span>
      </div>
    </div>
  );
};

export default Subscription;
