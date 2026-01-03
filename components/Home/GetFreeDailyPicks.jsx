"use client";

import Image from "next/image";
import { FaEnvelope, FaShieldAlt, FaTrophy } from "react-icons/fa";

export default function GetFreeDailyPicks() {
  return (
    <section
      className="relative w-full py-24 text-white bg-cover bg-center"
      style={{
        backgroundImage: "url('/home/red-bg.png')",
      }}
    >
    

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-[36px] font-extrabold leading-tight">
          Get Free Daily Picks
        </h2>

        <p className="mt-3 text-[14px] text-white/90 max-w-[620px] mx-auto">
          Join our newsletter and receive 3 expert picks delivered to your inbox
          every morning. No spam, just winning picks.
        </p>

        {/* Input */}
        <form className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="h-[44px] w-full sm:w-[340px] rounded-full px-5 text-[14px] bg-white text-black placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="h-[44px] px-6 rounded-full bg-black text-white text-[14px] font-semibold hover:bg-[#111] transition"
          >
            Get Free Picks
          </button>
        </form>

        {/* privacy text */}
        <p className="mt-3 text-[11px] text-white/70">
          For forever. Unsubscribe anytime. We respect your privacy.
        </p>

        {/* cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* card */}
          <div className="bg-white text-black rounded-2xl px-6 py-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffecec]">
              <FaEnvelope className="text-[#e53935]" />
            </div>
            <h4 className="font-semibold text-[15px]">Daily Delivery</h4>
            <p className="mt-1 text-[13px] text-gray-600">
              Fresh picks every morning at 7 AM EST
            </p>
          </div>

          <div className="bg-white text-black rounded-2xl px-6 py-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffecec]">
              <FaShieldAlt className="text-[#e53935]" />
            </div>
            <h4 className="font-semibold text-[15px]">No Spam</h4>
            <p className="mt-1 text-[13px] text-gray-600">
              Only valuable picks, never promotional emails
            </p>
          </div>

          <div className="bg-white text-black rounded-2xl px-6 py-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#ffecec]">
              <FaTrophy className="text-[#e53935]" />
            </div>
            <h4 className="font-semibold text-[15px]">Proven Results</h4>
            <p className="mt-1 text-[13px] text-gray-600">
              Track record of 80%+ accuracy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
