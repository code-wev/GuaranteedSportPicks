"use client";

import { useState } from "react";

export default function PromoCode() {
  const [promo, setPromo] = useState("");

  const handleApply = () => {
    if (promo === "WINNER20") {
      alert("Applied WINNER20: 20% off for returning customers!");
    } else if (promo === "NEWBIE15") {
      alert("Applied NEWBIE15: 15% off for first-time customers!");
    } else {
      alert("Invalid promo code!");
    }
  };

  return (
    <div className="bg-[#F9FAFB] pt-6 pb-16">
      <div className="max-w-5xl mx-auto mt-12 p-10 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl md:text-4xl font-semibold text-center mb-2">
          Have a Promo Code?
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your promotional code below to unlock exclusive discounts
        </p>

        {/* Input and Button */}
        <div className="flex justify-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            className="border border-red-400 rounded-md px-4 py-2 w-full md:w-2/4 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <button
            onClick={handleApply}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Apply
          </button>
        </div>

        {/* Promo Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-red-200 rounded-md p-4 py-8 bg-red-50">
            <h3 className="text-red-700 font-bold mb-1">WINNER20</h3>
            <p className="text-red-700 text-sm">
              Get 20% off any package - Limited time offer for returning
              customers
            </p>
          </div>
          <div className="border border-green-200 rounded-md p-4 py-8 bg-green-50">
            <h3 className="text-green-700 font-bold mb-1">NEWBIE15</h3>
            <p className="text-green-700 text-sm">
              Welcome bonus: 15% discount for first-time customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}