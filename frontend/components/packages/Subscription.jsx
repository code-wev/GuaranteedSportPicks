"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { SlEarphonesAlt } from "react-icons/sl";
import { TfiReload } from "react-icons/tfi";
import { FaCheck, FaStar, FaCalendarAlt } from "react-icons/fa";
import { MdSportsSoccer } from "react-icons/md";
import { useCreateSubscriptionMutation } from "@/feature/PaymentApi";

const SPORTS = ["NFL", "NBA", "MLB", "NHL"];

const PLANS = [
  {
    id: "DAILY",
    label: "Daily",
    price: 9.99,
    period: "/day",
    description: "Perfect for trying a single day",
    isSession: false,
    popular: false,
    accent: false,
    features: [
      "Access for 1 day",
      "All sport picks",
      "Expert analysis",
      "Email delivery",
    ],
  },
  {
    id: "WEEKLY",
    label: "Weekly",
    price: 49,
    period: "/week",
    description: "Most popular for casual bettors",
    isSession: false,
    popular: true,
    accent: true,
    features: [
      "7 days of picks",
      "All sport picks",
      "Priority support",
      "Detailed analysis",
      "Win rate tracking",
    ],
  },
  {
    id: "MONTHLY",
    label: "Monthly",
    price: 149,
    period: "/month",
    description: "Best value for serious bettors",
    isSession: false,
    popular: false,
    accent: false,
    features: [
      "30+ days of picks",
      "All sport picks",
      "VIP analysis",
      "Direct expert access",
      "Custom strategies",
      "Phone support",
    ],
  },
  {
    id: "SEASONAL",
    label: "Sessional",
    price: null, // dynamic
    period: "/custom",
    description: "Pick your own duration & price",
    isSeasonal: true,
    popular: false,
    accent: false,
    features: [
      "You choose the days",
      "All sport picks",
      "Flexible pricing",
      "Instant access",
    ],
  },
];

const PRICE_PER_DAY = 9.99;

export default function Subscription() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSports, setSelectedSports] = useState([]);
  const [customDays, setCustomDays] = useState(7);
  const [step, setStep] = useState(1); // 1=select plan, 2=select sport, 3=confirm
  const [error, setError] = useState("");

  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();

  const toggleSport = (sport) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport]
    );
  };

  const getPrice = (plan) => {
    if (plan.id === "SEASONAL") return +(PRICE_PER_DAY * customDays).toFixed(2);
    return plan.price;
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) return setError("Please select a plan.");
    if (!selectedSports.length) return setError("Please select at least one sport.");
    setError("");

    const body = {
      packageName: selectedPlan.id,
      selectedSport: selectedSports,
      price: getPrice(selectedPlan),
      isSeasonal: !!selectedPlan.isSeasonal,
      ...(selectedPlan.isSeasonal && {
        seasonalDays: Number(customDays),
        seasonalPrice: +(PRICE_PER_DAY * customDays).toFixed(2),
      }),
    };

    try {
      const res = await createSubscription(body).unwrap();
      const link = res?.data?.paymentLink;
      if (link) {
        window.location.href = link;
      } else {
        setError("Failed to get payment link. Please try again.");
      }
    } catch (err) {
      const msg = err?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="py-16 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-2">Subscription Packages</h2>
      <p className="text-gray-500 mb-12">
        Choose the perfect plan for your betting success
      </p>

      {/* ── Step 1: Plan Cards ─────────────────────── */}
      <div className="w-full max-w-7xl px-4 mb-10">
        <h3 className="text-lg font-semibold text-gray-700 mb-5">
          Step 1 — Select Your Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`
                  relative rounded-2xl p-6 flex flex-col cursor-pointer border-2 transition-all duration-300
                  hover:shadow-xl hover:-translate-y-1
                  ${plan.accent
                    ? "bg-[#B91C1C] text-white border-[#B91C1C]"
                    : "bg-white text-gray-800 border-gray-100"
                  }
                  ${isSelected
                    ? plan.accent
                      ? "ring-4 ring-yellow-300"
                      : "border-[#B91C1C] ring-2 ring-[#B91C1C]"
                    : ""
                  }
                `}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F5E104] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FaStar className="text-yellow-600" /> Most Popular
                  </span>
                )}

                <h3 className={`text-xl font-bold mb-1 ${plan.accent ? "text-white" : "text-gray-800"}`}>
                  {plan.label}
                </h3>
                <p className={`text-sm mb-4 ${plan.accent ? "text-red-100" : "text-gray-500"}`}>
                  {plan.description}
                </p>

                {plan.isSeasonal ? (
                  <div className="mb-4">
                    <p className="text-[12px] mb-1 font-medium text-gray-500">Custom Days</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={customDays}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setCustomDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-center text-gray-800 focus:outline-none focus:border-[#B91C1C]"
                      />
                      <span className="text-gray-500 text-sm">days</span>
                    </div>
                    <p className="text-3xl font-bold mt-2 text-[#B91C1C]">
                      ${(PRICE_PER_DAY * customDays).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <p className={`text-4xl font-extrabold mb-4 flex items-end gap-1 ${plan.accent ? "text-white" : "text-[#B91C1C]"}`}>
                    ${plan.price}
                    <span className={`text-base font-normal ${plan.accent ? "text-red-100" : "text-gray-400"}`}>
                      {plan.period}
                    </span>
                  </p>
                )}

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <FaCheck className={plan.accent ? "text-yellow-300" : "text-green-500"} />
                      <span className={plan.accent ? "text-red-50" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                    setStep(2);
                  }}
                  className={`
                    mt-auto py-2.5 px-5 rounded-xl font-semibold text-sm transition
                    ${plan.accent
                      ? "bg-white text-[#B91C1C] hover:bg-red-50"
                      : "bg-[#B91C1C] text-white hover:bg-red-800"
                    }
                    ${isSelected ? "ring-2 ring-offset-1 ring-[#B91C1C]" : ""}
                  `}
                >
                  {isSelected ? "✓ Selected" : "Select Plan"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step 2: Sport Selection ──────────────────── */}
      {selectedPlan && (
        <div className="w-full max-w-7xl px-4 mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-5">
            Step 2 — Select Sport(s){" "}
            <span className="text-sm font-normal text-gray-400">(Choose at least one)</span>
          </h3>
          <div className="flex flex-wrap gap-4">
            {SPORTS.map((sport) => {
              const active = selectedSports.includes(sport);
              return (
                <button
                  key={sport}
                  onClick={() => toggleSport(sport)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold text-sm transition-all
                    ${active
                      ? "bg-[#B91C1C] border-[#B91C1C] text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-[#B91C1C] hover:bg-red-50"
                    }
                  `}
                >
                  <MdSportsSoccer className="text-lg" />
                  {sport}
                  {active && <FaCheck className="text-white text-xs" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 3: Confirm & Subscribe ─────────────── */}
      {selectedPlan && selectedSports.length > 0 && (
        <div className="w-full max-w-7xl px-4 mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-5">
            Step 3 — Confirm & Subscribe
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 max-w-md">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="font-semibold text-gray-800">{selectedPlan.label}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-gray-500">Sport(s)</span>
              <span className="font-semibold text-gray-800">{selectedSports.join(", ")}</span>
            </div>
            {selectedPlan.isSeasonal && (
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-semibold text-gray-800 flex items-center gap-1">
                  <FaCalendarAlt className="text-[#B91C1C]" /> {customDays} days
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#B91C1C]">${getPrice(selectedPlan).toFixed(2)}</span>
            </div>

            {error && (
              <p className="mt-3 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="mt-4 w-full bg-[#B91C1C] hover:bg-red-800 text-white py-3 rounded-xl font-bold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Redirecting to Stripe..." : "🔒 Subscribe & Pay Securely"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              You will be redirected to Stripe's secure checkout
            </p>
          </div>
        </div>
      )}

      {/* ── Trust Badges ─────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-6 text-[#4B556C] text-sm">
        <span className="flex items-center gap-1">
          <IoShieldCheckmarkOutline /> Secure Payment
        </span>
        <span className="flex items-center gap-1">
          <TfiReload /> Cancel Anytime
        </span>
        <span className="flex items-center gap-1">
          <SlEarphonesAlt /> 24/7 Support
        </span>
      </div>
      <p className="mt-3 text-gray-400 text-xs">
        All packages include our 7-day money-back guarantee
      </p>
    </div>
  );
}
