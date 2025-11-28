"use client";

export default function PromoCode({ promoCode, onPromoCodeChange }) {
  const handleApply = () => {
    console.log("Applied promo code:", promoCode);
    alert(`Promo code "${promoCode}" applied!`);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-6">
      <h2 className="text-base font-medium mb-3">Promo Code (Optional)</h2>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
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
          onClick={handleApply}
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