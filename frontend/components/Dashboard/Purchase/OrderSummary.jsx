"use client";

import { MdOutlinePayment } from "react-icons/md";

export default function OrderSummary({ 
  selectedPackage, 
  selectedSport, 
  paymentModel, 
  promoCode, 
  onPurchase 
}) {
  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const packagePrices = {
      "Daily Pick": 25.00,
      "Weekly Pick": 99.00,
      "Monthly Pick": 299.00
    };
    
    return packagePrices[selectedPackage.name] || 0;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-base font-medium mb-4">Order Summary</h2>

      {/* Summary Rows */}
      <div className="text-sm text-gray-700 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-medium">
            {selectedPackage ? selectedPackage.name : "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Sport:</span>
          <span className="font-medium">
            {selectedSport ? selectedSport.name : "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Payment Model:</span>
          <span className="font-medium">
            {paymentModel || "Not selected"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Promo Code:</span>
          <span className="font-medium">
            {promoCode || "Not applied"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Total */}
      <div className="flex justify-between font-semibold text-[17px] mb-4">
        <span>Total</span>
        <span className="text-[#B91C1C]">${calculateTotal().toFixed(2)}</span>
      </div>

      {/* Payment Button */}
      <button
        onClick={onPurchase}
        disabled={!selectedPackage || !selectedSport || !paymentModel}
        className={`
          w-full 
          text-white 
          py-3 
          rounded-lg 
          font-medium
          text-sm
          flex items-center justify-center gap-2
          ${!selectedPackage || !selectedSport || !paymentModel
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#B91C1C] hover:bg-red-800"
          }
        `}
      >
        <MdOutlinePayment />
        Process to payment
      </button>
    </div>
  );
}