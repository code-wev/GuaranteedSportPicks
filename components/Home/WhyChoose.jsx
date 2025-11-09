"use client";

import Image from "next/image";

export default function WhyChoose() {
  return (
    <section
      className="w-full 
  bg-[url('/home/why-choose/why-choosebg.jpg')] bg-cover bg-center bg-no-repeat py-16"
    >
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 text-center">
        {/* Heading */}
        <h2 className="text-[28px] md:text-[36px] font-bold text-[#111] tracking-[-0.02em]">
          Why Choose <span className="text-[#ff3b3b]">SportPicks</span>?
        </h2>
        <p className="mt-2 text-[14px] text-[#7a7a7a] max-w-[600px] mx-auto">
          We’re not just another sports betting service. We’re your trusted
          partner in making smarter, more profitable bets.
        </p>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Card 1 - slightly lower */}
          <div className="bg-[#e9f4ee] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 translate-y-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/why-choose/pic1.png"
                alt="Transparent Odds"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-medium text-[#111]">
              Verified Records
            </h3>
            <p className="mt-2 text-sm text-[#555] leading-relaxed">
              All our picks are tracked and verified by independent third
              parties. Complete transparency in our win/loss records.
            </p>
          </div>

          {/* Card 2 - slightly higher */}
          <div className="bg-[#eaf3f9] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 -translate-y-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/why-choose/pic2.png"
                alt="Transparent Odds"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-medium text-[#111]">
              Transparent Odds
            </h3>
            <p className="mt-2 text-sm text-[#555] leading-relaxed">
              Real-time odds from multiple sports books. We show you exactly
              where to get the best value for every pick.
            </p>
          </div>

          {/* Card 3 - same as Card 1 (lower) */}
          <div className="bg-[#f1ebfa] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 translate-y-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/why-choose/pic3.png"
                alt="Transparent Odds"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-medium text-[#111]">Secure Payments</h3>
            <p className="mt-2 text-sm text-[#555] leading-relaxed">
              Bank-level security with encrypted transactions. Your payment
              information is always protected and secure.
            </p>
          </div>

          {/* Card 4 - same as Card 2 (higher) */}
          <div className="bg-[#fde9eb] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 -translate-y-6">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/why-choose/pic4.png"
                alt="Transparent Odds"
                width={64}
                height={64}
              />
            </div>
            <h3 className="text-xl font-medium text-[#111]">
              Pay After You Win
            </h3>
            <p className="mt-2 text-sm text-[#555] leading-relaxed">
              Unique guarantee system — only pay for winning picks. If our pick
              loses, you get your next pick absolutely free.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="mt-16 bg-[#E53935] text-white px-6 py-3 rounded-full font-semibold text-[15px] hover:bg-[#e03131] transition-all duration-200 shadow-md">
          Experience the Difference Today
        </button>
      </div>
    </section>
  );
}
