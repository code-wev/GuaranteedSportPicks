"use client";

import Image from "next/image";
import { FaLock } from "react-icons/fa";

export default function ExpertPicksHero() {
  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-[1500px] mx-auto px-6">
        {/* ===== HEADER ===== */}
        <div className="text-center mb-20">
          <h2 className="text-[40px] font-bold text-[#111827] mb-4">
            Expert Picks Just For You
          </h2>

          <p className="text-[15px] text-[#6B7280] max-w-[560px] mx-auto mb-8">
            Our top analysts have identified today’s best betting opportunity
            with 94% confidence
          </p>

          <button className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8 py-3 rounded-full text-[14px] font-semibold transition">
            Unlock This Pick Now
            <FaLock className="text-[12px]" />
          </button>
        </div>

        {/* ===== MATCHUP ===== */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-10">
          {/* LEFT TEAM */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/expertPics/t1.png"
              alt="Team One"
              width={380}
              height={420}
              className="object-contain"
              priority
            />
          </div>

          {/* CENTER VS */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2">
              <Image
                src="/expertPics/p1.png"
                alt="Dallas Cowboys"
                width={42}
                height={42}
              />
              <span className="text-[#DC2626] text-[22px] font-bold">VS</span>
              <Image
                src="/expertPics/p2.png"
                alt="New York Giants"
                width={42}
                height={42}
              />
            </div>

            <div className="flex gap-8 text-[13px] text-[#6B7280]">
              <span>Dallas Cowboys</span>
              <span>New York Giants</span>
            </div>
          </div>

          {/* RIGHT TEAM */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/expertPics/t2.png"
              alt="Team Two"
              width={380}
              height={420}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
