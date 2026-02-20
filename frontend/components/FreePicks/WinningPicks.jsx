"use client";

import { FiHeadphones } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { HiChartBar } from "react-icons/hi";

const WinningPicks = () => {
  return (
    <section className="w-full py-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-2xl md:text-4xl font-semibold text-black">
          Want More Winning Picks?
        </h2>
        <p className="text-xl mt-4">
          Join our premium service for daily expert picks, detailed analysis,
          and exclusive insider information
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#B91C1C] flex items-center justify-center text-white text-2xl">
              <HiChartBar />
            </div>
            <h3 className="font-semibold text-lg mt-4">Data-Driven Analysis</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-xs">
              Every pick is backed by comprehensive statistical analysis and
              advanced modeling techniques.
            </p> 
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#B91C1C] flex items-center justify-center text-white text-2xl">
              <GoShieldCheck />
            </div>
            <h3 className="font-semibold text-lg mt-4">Transparent Results</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-xs">
              All our picks and results are tracked publicly. No hidden records
              or inflated win rates.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#B91C1C] flex items-center justify-center text-white text-2xl">
              <FiHeadphones />
            </div>
            <h3 className="font-semibold text-lg mt-4">24/7 Support</h3>
            <p className="text-sm text-gray-600 mt-2 max-w-xs">
              Our team is available around the clock to answer questions and
              provide guidance.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col items-center mt-12 space-y-4">
          {/* Premium Button */}
          <button className="bg-[#B91C1C] text-white px-6 md:px-8 py-3 rounded-md font-medium text-sm md:text-base hover:bg-red-700 transition">
            Get Premium Access Now
          </button>

          <p className="text-[#475569] text-xs">
            30-day money-back guarantee • Cancel anytime
          </p>
        </div>
      </div> 
    </section>
  );
};

export default WinningPicks;
