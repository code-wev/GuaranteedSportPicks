"use client";
import { FaCheck } from "react-icons/fa";

export default function SelectPackage({
  selectedPackage,
  onSelectPackage,
  seasonalDays,
  setSeasonalDays,
  seasonalPrice,
  setSeasonalPrice,
  validationErrors,
}) {
  const packages = [
    {
      id: 1,
      name: "DAILY",
      displayName: "Daily Pick",
      description: "Single premium Pick for today",
      price: 25.0,
      features: ["1 Expert Pick", "Detailed Analysis", "Email Delivery"],
      popular: false,
    },
    {
      id: 2,
      name: "WEEKLY",
      displayName: "Weekly Pick",
      description: "7 days of premium picks",
      price: 99.0,
      features: [
        "7 Expert Pick",
        "Detailed Analysis",
        "Priority Support",
        "Win Rate Tracking",
      ],
      popular: true,
    },
    {
      id: 3,
      name: "MONTHLY",
      displayName: "Monthly Pick",
      description: "Full month access",
      price: 299.0,
      features: [
        "30+ Expert Pick",
        "VIP Analysis",
        "Direct Expert Access",
        "Custom Strategies",
      ],
      popular: false,
    },
    {
      id: 4,
      name: "SEASONAL",
      displayName: "Seasonal Pick",
      description: "Custom duration and price",
      price: null,
      features: [
        "Custom Days",
        "Custom Price",
        "Flexible Access",
        "Personalized Picks",
      ],
      popular: false,
    },
  ];

  return (
    <div className='bg-white rounded-xl p-5 shadow-sm mb-8'>
      <h2 className='text-lg font-medium mb-4'>Select Package</h2>

      <div className='grid md:grid-cols-3 gap-4'>
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`
              border rounded-xl p-5 h-auto hover:shadow-md cursor-pointer
              ${
                selectedPackage === pkg.name
                  ? "bg-red-50 border-[#B91C1C]"
                  : "border-gray-100"
              }
              ${pkg.popular ? "relative" : ""}
            `}
            onClick={() => onSelectPackage(pkg.name)}>
            {pkg.popular && (
              <span className='absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 text-xs rounded-full'>
                Most Popular
              </span>
            )}

            <h3 className='font-semibold text-2xl text-center mb-1'>
              {pkg.displayName}
            </h3>
            <p className='text-center text-gray-500 text-lg mb-3'>
              {pkg.description}
            </p>
            {pkg.name === "SEASONAL" ? (
              <div className='text-center mb-3'>
                <div className='mb-2'>
                  <label className='block text-sm text-gray-600'>Days</label>
                  <input
                    type='number'
                    value={seasonalDays}
                    onChange={(e) => setSeasonalDays(e.target.value)}
                    className='w-20 px-2 py-1 border rounded text-center'
                    placeholder='30'
                    min='1'
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-600'>
                    Price ($)
                  </label>
                  <input
                    type='number'
                    value={seasonalPrice}
                    onChange={(e) => setSeasonalPrice(e.target.value)}
                    className='w-20 px-2 py-1 border rounded text-center'
                    placeholder='100'
                    min='1'
                    step='0.01'
                  />
                </div>
              </div>
            ) : (
              <p className='text-center text-[#B91C1C] font-semibold text-[32px] mb-3'>
                ${pkg.price.toFixed(2)}
              </p>
            )}

            <PackageList items={pkg.features} />
          </div>
        ))}
      </div>

      {validationErrors?.packageName && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-600 text-sm'>{validationErrors.packageName}</p>
        </div>
      )}

      {selectedPackage === "SEASONAL" && (
        <div className='mt-4 space-y-2'>
          {(validationErrors?.seasonalDays ||
            validationErrors?.seasonalPrice) && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
              {validationErrors.seasonalDays && (
                <p className='text-red-600 text-sm'>
                  {validationErrors.seasonalDays}
                </p>
              )}
              {validationErrors.seasonalPrice && (
                <p className='text-red-600 text-sm'>
                  {validationErrors.seasonalPrice}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PackageList({ items }) {
  return (
    <ul className='text-gray-700 space-y-2 pl-14 mt-6'>
      {items.map((item, i) => (
        <li key={i} className='flex items-center gap-2'>
          <FaCheck className='text-green-600' /> {item}
        </li>
      ))}
    </ul>
  );
}
