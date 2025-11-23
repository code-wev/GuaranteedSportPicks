"use client";
import { FaCheck } from "react-icons/fa";

export default function SelectPackage() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-lg font-medium mb-4">Select Package</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Package 1 */}
        <div className="border border-gray-100 rounded-xl p-5 h-[326px] hover:shadow-md cursor-pointer">
          <h3 className="font-semibold text-2xl text-center mb-1">
            Daily Pick
          </h3>
          <p className="text-center text-gray-500 text-lg mb-3">
            Single premium Pick for today
          </p>
          <p className="text-center text-[#B91C1C] font-semibold text-[32px] mb-3">
            $25.00
          </p>
          <PackageList
            items={["1 Expert Pick", "Detailed Analysis", "Email Delivery"]}
          />
        </div>

        {/* Package 2 */}
        <div className="border bg-red-50 rounded-xl p-5 hover:shadow-md cursor-pointer border-[#B91C1C] relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 text-xs rounded-full">
            Most Popular
          </span>

          <h3 className="font-semibold text-2xl text-center mb-1">
            Daily Pick
          </h3>
          <p className="text-center text-gray-500 text-lg mb-3">
            7 days of premium picks
          </p>
          <p className="text-center text-[#B91C1C] font-semibold text-[32px] mb-3">
            $99.00
          </p>

          <PackageList
            items={[
              "7 Expert Pick",
              "Detailed Analysis",
              "Priority Support",
              "Win Rate Tracking",
            ]}
          />
        </div>

        {/* Package 3 */}
        <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md cursor-pointer">
          <h3 className="font-semibold text-2xl text-center mb-1">
            Daily Pick
          </h3>
          <p className="text-center text-gray-500 text-lg mb-3">
            Full month access
          </p>
          <p className="text-center text-[#B91C1C] font-semibold text-[32px] mb-3">
            $299.00
          </p>

          <PackageList
            items={[
              "30+ Expert Pick",
              "VIP Analysis",
              "Direct Expert Access",
              "Custom Strategies",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function PackageList({ items }) {
  return (
    <ul className="text-gray-700 space-y-2 pl-14 mt-6">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2">
          <FaCheck className="text-green-600" /> {item}
        </li>
      ))}
    </ul>
  );
}
