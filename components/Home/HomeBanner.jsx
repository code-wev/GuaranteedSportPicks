import Image from "next/image";
import React from "react";

const HomeBanner = () => {
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/home/homeBannerBg.png')",
        }}
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between px-5 py-24 min-h-[80vh]">
        {/* ✅ Added flex-grow alignment */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          {/* LEFT SIDE */}
          <div className="text-white w-full md:w-[50%]">
            <h1 className="text-[44px] md:text-[63.06px] font-extrabold leading-[1.2] mb-5">
              Win Smarter with <br /> Expert Sports Picks
            </h1>
            <p className="text-[#E5E7EB] mb-10 text-[18px] ">
              Trusted picks. Verified records. Guaranteed results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              {/* Primary Button */}
              <button className="flex items-center gap-2 bg-[#E53935] hover:bg-[#d53240] text-white px-7 py-3 rounded-full font-semibold text-sm transition-all shadow-md">
                <span className="w-3 h-3 bg-[#FFCDD2] rounded-full"></span>
                Get Today’s Pick
              </button>

              {/* Secondary Button */}
              <button className="flex items-center gap-2 border border-[#E53935] text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-[#E63946]/10 transition-all">
                <span className="w-3 h-3 bg-[#FFCDD2] rounded-full"></span>
                See Packages
              </button>
            </div>

            {/* Bottom Icons */}
            <div className="flex flex-wrap items-center gap-10 text-white text-sm font-semibold mt-2">
              {/* Secure Payments */}
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <Image
                    src="/home/icon1.png"
                    alt="Secure Payments"
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
                <span>Secure Payments</span>
              </div>

              {/* Verified Records */}
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <Image
                    src="/home/icon2.png"
                    alt="Verified Records"
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
                <span>Verified Records</span>
              </div>

              {/* Affiliate Partners */}
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5">
                  <Image
                    src="/home/icon3.png"
                    alt="Affiliate Partners"
                    fill
                    className="object-contain"
                    sizes="20px"
                  />
                </div>
                <span>Affiliate Partners</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full md:w-[45%] flex justify-end mt-12 md:mt-0">
            <div className="bg-[#591616] backdrop-blur-md border border-[#cf8d8c] rounded-2xl p-6 md:p-8 w-full max-w-[621px] ">
              <h3 className="text-white text-[28px] font-semibold mb-5">
                Live Odds Board
              </h3>
              <ul className="space-y-4">
                {/* Team 1 */}
                <li className="flex items-center justify-between bg-[#FFFFFF14]/80 rounded-xl px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-[#002244] text-white text-[12px] font-bold rounded-full">
                      DAL
                    </span>
                    <span className="text-white font-medium">Cowboys</span>
                  </div>
                  <span className="text-[#28C76F] font-bold">-145</span>
                </li>

                {/* Team 2 */}
                <li className="flex items-center justify-between bg-[#FFFFFF14]/80 rounded-xl px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-[#A71930A6] text-white text-[12px] font-bold rounded-full">
                      NYG
                    </span>
                    <span className="text-white font-medium">Giants</span>
                  </div>
                  <span className="text-[#28C76F] font-bold">+135</span>
                </li>

                {/* Team 3 */}
                <li className="flex items-center justify-between bg-[#FFFFFF14]/80 rounded-xl px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 bg-[#4F2683] text-white text-[12px] font-bold rounded-full">
                      KC
                    </span>
                    <span className="text-white font-medium">Chiefs</span>
                  </div>
                  <span className="text-[#28C76F] font-bold">-210</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
