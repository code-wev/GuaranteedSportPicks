"use client";
import { FaCheck } from "react-icons/fa";

export default function SelectPackage({ selectedPackage, onSelectPackage }) {
  const packages = [
    {
      id: 1,
      name: "Daily Pick",
      description: "Single premium Pick for today",
      price: 25.00,
      features: ["1 Expert Pick", "Detailed Analysis", "Email Delivery"],
      popular: false
    },
    {
      id: 2,
      name: "Weekly Pick",
      description: "7 days of premium picks",
      price: 99.00,
      features: ["7 Expert Pick", "Detailed Analysis", "Priority Support", "Win Rate Tracking"],
      popular: true
    },
    {
      id: 3,
      name: "Monthly Pick",
      description: "Full month access",
      price: 299.00,
      features: ["30+ Expert Pick", "VIP Analysis", "Direct Expert Access", "Custom Strategies"],
      popular: false
    }
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-lg font-medium mb-4">Select Package</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div 
            key={pkg.id}
            className={`
              border rounded-xl p-5 lg:h-[326px] hover:shadow-md cursor-pointer
              ${selectedPackage?.id === pkg.id 
                ? "bg-red-50 border-[#B91C1C]" 
                : "border-gray-100"
              }
              ${pkg.popular ? "relative" : ""}
            `}
            onClick={() => onSelectPackage(pkg)}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 text-xs rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="font-semibold text-2xl text-center mb-1">
              {pkg.name}
            </h3>
            <p className="text-center text-gray-500 text-lg mb-3">
              {pkg.description}
            </p>
            <p className="text-center text-[#B91C1C] font-semibold text-[32px] mb-3">
              ${pkg.price.toFixed(2)}
            </p>
            
            <PackageList items={pkg.features} />
          </div>
        ))}
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