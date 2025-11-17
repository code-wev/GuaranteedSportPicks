"use client";
import { useState } from "react";

export default function PromoCode() {
  const [promo, setPromo] = useState("");

  const handleApply = () => {
    alert(`Promo code applied: ${promo}`);
  };

  return (
    <div className="bg-[#F9FAFB] w-full h-[480px] flex items-center">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-md w-full">
        <h2 className="text-4xl font-semibold text-center mb-2">Have a Promo Code?</h2>
        <p className="text-center font-medium mb-6">
          Enter your promotional code below to unlock exclusive discounts
        </p>

        <div className="flex gap-2 mb-10 max-w-md mx-auto">
          <input
            type="text"
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 border border-red-500 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleApply}
            className="bg-[#B91C1C] text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
          >
            Apply
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 border border-red-200 bg-red-50 rounded-xl py-8 px-4">
            <h3 className="text-[#8E1515] font-bold mb-2 text-2xl">WINNER20</h3>
            <p className="text-red-700 text-sm">
              Get 20% off any package - Limited time offer for returning customers
            </p>
          </div>

          <div className="flex-1 border border-green-200 bg-green-50 rounded-xl p-4 py-8">
            <h3 className="text-[#1D8652] font-bold mb-2 text-2xl">NEWBIE15</h3>
            <p className="text-green-700 text-sm">
              Welcome bonus: 15% discount for first-time customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
