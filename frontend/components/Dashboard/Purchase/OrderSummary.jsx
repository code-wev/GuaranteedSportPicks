"use client";

import { MdOutlinePayment } from "react-icons/md";

export default function OrderSummary({ 
  packageName, 
  selectedSport, 
  seasonalDays,
  seasonalPrice,
  total,
  onPurchase,
  isLoading
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-base font-medium mb-4">Order Summary</h2>

      {/* Summary Rows */}
      <div className="text-sm text-gray-700 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-medium">
            {packageName || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Sport:</span>
          <span className="font-medium">
            {selectedSport.length > 0 ? selectedSport.join(", ") : "Not selected"}
          </span>
        </div>

        {packageName === "SEASONAL" && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-600">Days:</span>
              <span className="font-medium">
                {seasonalDays || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-medium">
                ${seasonalPrice || "0.00"}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between border-t pt-2 mt-2">
          <span className="text-gray-800 font-medium">Total:</span>
          <span className="font-bold text-[#B91C1C]">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Payment Button */}
      <button
        onClick={onPurchase}
        disabled={!packageName || selectedSport.length === 0 || (packageName === "SEASONAL" && (!seasonalDays || !seasonalPrice)) || isLoading}
        className={`
          w-full 
          text-white 
          py-3 
          rounded-lg 
          font-medium
          text-sm
          flex items-center justify-center gap-2
          ${!packageName || selectedSport.length === 0 || (packageName === "SEASONAL" && (!seasonalDays || !seasonalPrice)) || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#B91C1C] hover:bg-red-800"
          }
        `}
      >
        <MdOutlinePayment size={18} />
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}