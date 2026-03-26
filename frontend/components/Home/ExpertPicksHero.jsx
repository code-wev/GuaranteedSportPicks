"use client";

import Image from "next/image";
import { FaLock } from "react-icons/fa";

export default function ExpertPicksHero() {
  return (
    <section className="w-full bg-white overflow-hidden">
      {/* Fixed-height hero like Figma */}
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 h-[720px] lg:h-[820px]">
        {/* ================= HEADER ================= */}
        <div className="pt-[70px] lg:pt-[95px] text-center">
          <h2 className="text-[34px] sm:text-[42px] lg:text-[52px] leading-[42px] sm:leading-[50px] lg:leading-[60px] font-extrabold text-[#0F172A]">
            Expert Picks Just For You
          </h2>

          <p className="mt-[12px] lg:mt-[14px] text-[13px] lg:text-[14px] leading-[20px] lg:leading-[22px] text-[#6B7280] max-w-[620px] mx-auto">
            Our top analysts have identified today’s best betting opportunity
            with 94% confidence
          </p>

          <button className="mt-[22px] lg:mt-[26px] inline-flex items-center gap-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white px-[26px] lg:px-[30px] py-[11px] lg:py-[12px] rounded-full text-[13px] lg:text-[14px] font-semibold transition">
            Unlock This Pick Now
            <FaLock className="text-[11px] lg:text-[12px] relative top-[1px]" />
          </button>
        </div>

        {/* ================= MATCHUP ================= */}
        <div className="absolute left-0 right-0 bottom-0">
          <div className="mx-auto max-w-[1320px]">
            <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-end">
              {/* LEFT TEAM */}
              <div className="flex justify-end">
                <div className="h-[360px] flex items-end">
                  <Image
                    src="/expertPics/team1.png"
                    alt="Left Team"
                    width={520}
                    height={360}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* CENTER VS — SLIGHTLY LOWER */}
              <div className="px-[50px] flex items-center justify-center self-center translate-y-[48px]">
                <CenterVS />
              </div>

              {/* RIGHT TEAM */}
              <div className="flex justify-start">
                <div className="h-[360px] flex items-end">
                  <Image
                    src="/expertPics/team2.png"
                    alt="Right Team"
                    width={520}
                    height={360}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Mobile / Tablet */}
            <div className="lg:hidden flex flex-col items-center gap-[18px] pb-[10px]">
              <Image
                src="/expertPics/team1.png"
                alt="Left Team"
                width={300}
                height={210}
                className="object-contain"
                priority
              />

              <CenterVS />

              <Image
                src="/expertPics/team2.png"
                alt="Right Team"
                width={300}
                height={210}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= CENTER VS ================= */
function CenterVS() {
  return (
    <div className="grid grid-cols-[auto_auto_auto] items-center gap-[12px] lg:gap-[14px]">
      {/* LEFT LOGO */}
      <div className="flex flex-col items-center">
        <div className="w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] rounded-full overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/expertPics/p1.png"
            alt="Dallas Cowboys"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="mt-[6px] lg:mt-[8px] text-[12px] lg:text-[13px] text-[#6B7280]">
          Dallas Cowboys
        </span>
      </div>

      {/* VS */}
      <span className="text-[#DC2626] text-[20px] lg:text-[22px] font-bold tracking-wide">
        VS
      </span>

      {/* RIGHT LOGO */}
      <div className="flex flex-col items-center">
        <div className="w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] rounded-full overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/expertPics/p2.png"
            alt="New York Giants"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="mt-[6px] lg:mt-[8px] text-[12px] lg:text-[13px] text-[#6B7280]">
          New York Giants
        </span>
      </div>
    </div>
  );
}
