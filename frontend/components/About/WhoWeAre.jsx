"use client";

import Image from "next/image";

const WhoWeAre = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
        
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-2xl md:text-4xl font-semibold text-[#1A1A1A] mb-6">
            Who We Are
          </h2>

          <p className="text-gray-700 text-sm md:text-xl leading-relaxed mb-4">
            We are a team of seasoned sports betting professionals with over 15 years of
            combined experience in the industry. Our expertise spans across all major
            sports leagues including NFL, NBA, MLB, NHL, and international soccer
            competitions.
          </p>

          <p className="text-gray-700 text-sm md:text-xl leading-relaxed mb-4">
            Founded by former professional athletes and sports analysts, our company
            was built on the principle that successful sports betting requires deep
            knowledge, statistical analysis, and disciplined money management
            strategies.
          </p>

          <p className="text-gray-700 text-sm md:text-xl leading-relaxed">
            Today, we serve thousands of clients worldwide, providing them with the
            insights and strategies they need to make informed betting decisions and
            achieve long-term profitability.
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full">
          <div className="rounded-xl overflow-hidden shadow-md">
            <Image
              src="/about/whoweare.png" // Replace with your image
              width={700}
              height={500}
              alt="Analytics Screens"
              className="object-cover w-full h-[450px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
