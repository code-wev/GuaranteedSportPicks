"use client";

import Image from "next/image";

export default function LiveOddsPicks() {
  return (
    <section className="w-full bg-[#FFF3F3]">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-10 pb-14">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-[28px] md:text-[42px] font-bold text-[#111] tracking-[-0.02em]">
            Live Odds &amp; Picks
          </h2>
          <p className="mt-2 text-[13px] md:text-[14px] text-[#7A7A7A]">
            Real-time updates from our expert analysts
          </p>
        </div>

        {/* Live Ticker pill */}
        <div className="mt-6">
          <div className="mx-auto max-w-[980px] h-[64px] rounded-full bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-[#00000008] h-[52px] px-5 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#111]">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E63946]" />
              <span className="uppercase tracking-wide text-[#111]">
                Live Picks
              </span>
            </div>

            {/* Center matchup */}
            <div className="text-[14px] md:text-[15px] font-semibold">
              <span className="text-[#E63946]">Dodgers vs Padres</span>
              <span className="mx-2 text-[#E63946]">-</span>
              <span className="text-[#E63946]">Dodgers -1.5 (+140)</span>
            </div>

            {/* Right time */}
            <div className="text-[12px] text-[#8C8C8C] whitespace-nowrap">
              Updated 11:52:49 AM
            </div>
          </div>
        </div>

        {/* Partners block */}
        <div className="mt-10">
          {/* Card container */}
          <div className="mt-5 rounded-[88px] bg-white border border-[#00000010] shadow-[0_12px_32px_rgba(0,0,0,0.08)] px-5 md:px-8 py-6">
            <h3 className="text-center text-[18px] pb-5  md:text-[26px] font-semibold text-[#111]">
              Our Trusted Sportsbook Partners
            </h3>
            {/* Logos row */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 items-start justify-items-center">
              {/* Partner 1 */}
              <div className="flex flex-col items-center">
                <div className="w-[180px] h-[120px] bg-[#FFF5F5] rounded-[400px] border border-[#FEE9E9] flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="relative w-[100px] h-[46px]">
                    <Image
                      src="/home/liveOdds/img2.png"
                      alt="Caesars"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[13px] text-black font-medium">
                    Caesars
                  </p>
                </div>
              </div>

              {/* Partner 2 */}
              <div className="flex flex-col items-center">
                <div className="w-[180px] h-[120px] bg-[#FFF5F5] rounded-[400px] border border-[#FEE9E9] flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="relative w-[100px] h-[46px]">
                    <Image
                      src="/home/liveOdds/img1.png"
                      alt="FanDuel"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[13px] text-black font-medium">
                    FanDuel
                  </p>
                </div>
              </div>

              {/* Partner 3 */}
              <div className="flex flex-col items-center">
                <div className="w-[180px] h-[120px] bg-[#FFF5F5] rounded-[400px] border border-[#FEE9E9] flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="relative w-[100px] h-[46px]">
                    <Image
                      src="/home/liveOdds/img2.png"
                      alt="BetMGM"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[13px] text-black font-medium">
                    BetMGM
                  </p>
                </div>
              </div>

              {/* Partner 4 */}
              <div className="flex flex-col items-center">
                <div className="w-[180px] h-[120px] bg-[#FFF5F5] rounded-[400px] border border-[#FEE9E9] flex flex-col items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="relative w-[100px] h-[46px]">
                    <Image
                      src="/home/liveOdds/img1.png"
                      alt="Caesars"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="mt-2 text-[13px] text-black font-medium">
                    Caesars
                  </p>
                </div>
              </div>
            </div>

            {/* small caption */}
            <p className="text-center text-[12.5px] md:text-[16px] text-[#7A7A7A] mt-10">
              Get the best odds and exclusive bonuses through our partner links
            </p>

            {/* CTA */}
            <div className="mt-4 flex justify-center">
              <button className="inline-flex items-center justify-center h-[44px] px-6 rounded-full bg-[#E53935] text-white text-[14px] font-semibold hover:bg-[#d23340] transition">
                View All Partners
              </button>
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          <StatPill
            value="250+"
            label="Daily Picks"
            valueClass="text-[#E63946]"
          />
          <StatPill value="85%" label="Win Rate" valueClass="text-[#28C76F]" />
          <StatPill
            value="15"
            label="Sports Covered"
            valueClass="text-[#E63946]"
          />
          <StatPill
            value="24/7"
            label="Live Updates"
            valueClass="text-[#28C76F]"
          />
        </div>
      </div>
    </section>
  );
}

/* StatPill Subcomponent */
function StatPill({ value, label, valueClass }) {
  return (
    <div className="h-[120px] rounded-[120px] bg-white border border-[#00000010] flex items-center justify-center text-center">
      <div>
        <div className={`text-[26px] leading-none font-bold ${valueClass}`}>
          {value}
        </div>
        <div className="mt-1 text-[12.5px] text-[#7A7A7A]">{label}</div>
      </div>
    </div>
  );
}
