"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const slides = [
  {
    title: "FREE\nNBA Picks",
    description:
      "Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day. Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day.",
    image: "/home/pic1.png",
  },
  {
    title: "10% CASH BACK\nfor purchases",
    description:
      "Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day. Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day.",
    image: "/home/pic4.png",
  },
  {
    title: "FREE\nSports Picks",
    description:
      "Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day. Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day.",
    image: "/home/pic3.png",
  },
  {
    title: "$25 BONUS\non signup",
    description:
      "Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day. Unlike most other handicapping services, we offer our clients an opportunity to view which games we have in our card for the day.",
    image: "/home/pic2.png",
  },
];

export default function HomeBanner() {
  //Hello Buff
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden [direction:ltr]">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/home/homeBannerBg.png')" }}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-24 min-h-[80vh]">
        {/* ================= SLIDER ================= */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          speed={900}
          loop
          slidesPerView={1}
          className="w-full mb-12"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-16">
                {/* LEFT CONTENT */}
                <div className="w-full md:w-[50%] text-white">
                  <h1 className="text-[42px] lg:text-[64px] font-extrabold leading-[1.15] mb-6 whitespace-pre-line">
                    {slide.title}
                  </h1>

                  <p className="text-[#E5E7EB] text-[18px] leading-relaxed max-w-[560px]">
                    {slide.description}
                  </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="w-full md:w-[50%] flex justify-end">
                  <div className="relative w-full max-w-[620px] h-[360px] md:h-[440px]">
                    <Image
                      src={slide.image}
                      alt="Banner visual"
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* ================= CTA BUTTONS (STATIC) ================= */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <button className="flex items-center gap-2 bg-[#E53935] text-white hover:bg-[#d53240] px-8 py-3 rounded-full font-semibold text-sm transition">
            <span className="w-2.5 h-2.5 bg-[#FFCDD2] rounded-full" />
            Get Today’s Pick
          </button>

          <button className="flex items-center gap-2 border border-[#E53935] px-8 py-3 rounded-full font-semibold text-sm text-[#FFCDD2] hover:bg-white/10 transition">
            <span className="w-2.5 h-2.5 bg-[#FFCDD2] rounded-full" />
            See Packages
          </button>
        </div>

        {/* ================= TRUST ROW (STATIC) ================= */}
        <div className="flex flex-wrap items-center gap-10 text-white text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Image src="/home/icon1.png" alt="" width={18} height={18} />
            Secure Payments
          </div>

          <div className="flex items-center gap-2">
            <Image src="/home/icon2.png" alt="" width={18} height={18} />
            Verified Records
          </div>

          <div className="flex items-center gap-2">
            <Image src="/home/icon3.png" alt="" width={18} height={18} />
            Affiliate Partners
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
