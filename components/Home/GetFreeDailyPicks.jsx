"use client";

import { FaEnvelope, FaShieldAlt, FaTrophy } from "react-icons/fa";

export default function GetFreeDailyPicks() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-[980px] mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-[28px] md:text-[40px] font-bold text-[#E53935] mb-3">
          Get Free Daily Picks
        </h2>
        <p className="text-[#555] text-[15px] leading-relaxed mb-8">
          Join our newsletter and receive 3 expert picks delivered to your inbox every morning.<br />
          No spam, just winning picks.
        </p>

        {/* Email Input */}
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:w-[360px] h-[46px] px-5 rounded-full border border-[#E5E5E5] text-[14px] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#E63946]/40 transition"
          />
          <button
            type="submit"
            className="h-[46px] px-6 rounded-full bg-black text-white font-semibold text-[14px] hover:bg-[#222] transition"
          >
            Get Free Picks
          </button>
        </form>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="rounded-[20px] bg-[#FFFBFB] border border-[#FFC9C9] p-6 flex flex-col items-center text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 flex items-center justify-center bg-[#E63946]/10 rounded-full mb-3">
              <FaEnvelope className="text-[#E63946] text-[18px]" />
            </div>
            <h4 className="text-[16px] font-semibold text-[#222] mb-1">
              Daily Delivery
            </h4>
            <p className="text-[14px] text-[#666]">
              Fresh picks every morning at 7 AM EST
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-[20px] bg-[#FFFBFB] border border-[#FFC9C9] p-6 flex flex-col items-center text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 flex items-center justify-center bg-[#E63946]/10 rounded-full mb-3">
              <FaShieldAlt className="text-[#E63946] text-[18px]" />
            </div>
            <h4 className="text-[16px] font-semibold text-[#222] mb-1">
              No Spam
            </h4>
            <p className="text-[14px] text-[#666]">
              Only valuable picks, never promotional emails
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-[20px] bg-[#FFFBFB] border border-[#FFC9C9] p-6 flex flex-col items-center text-center shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
            <div className="w-12 h-12 flex items-center justify-center bg-[#E63946]/10 rounded-full mb-3">
              <FaTrophy className="text-[#E63946] text-[18px]" />
            </div>
            <h4 className="text-[16px] font-semibold text-[#222] mb-1">
              Proven Results
            </h4>
            <p className="text-[14px] text-[#666]">
              Track record of 80%+ accuracy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
