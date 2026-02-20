"use client";

export default function PromoCode() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-lg font-medium mb-4">Promo Code (Optional)</h2>

      <div className="flex gap-3">
        <input
          className="border rounded-xl flex-1 px-3 py-2"
          placeholder="Enter promo code"
        />
        <button className="bg-red-600 text-white rounded-xl px-5">Apply</button>
      </div>
    </div>
  );
}
