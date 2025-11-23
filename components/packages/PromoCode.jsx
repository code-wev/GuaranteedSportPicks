"use client";

export default function PromoCode() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
      <h2 className="text-base font-medium mb-3">Promo Code (Optional)</h2>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter promo code"
          className="
            w-full 
            h-[42px]
            border 
            border-gray-300 
            rounded-lg 
            px-3 
            text-sm
            focus:outline-none
          "
        />

        <button
          className="
            bg-[#B91C1C] 
            text-white 
            text-sm 
            px-5 
            h-[42px]
            rounded-lg 
            hover:bg-red-700
          "
        >
          Apply
        </button>
      </div>
    </div>
  );
}
