"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";

const partners = [
  { name: "PointsBet", logo: "/sponsors/l1.png" },
  { name: "Caesars", logo: "/sponsors/l2.png" },
  { name: "BetMGM", logo: "/sponsors/l3.png" },
  { name: "DraftKings", logo: "/sponsors/l4.png" },
  { name: "FanDuel", logo: "/sponsors/l5.png" },
];

export default function TrustedPartners() {
  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      {/* TITLE (MATCH FIGMA) */}
      <div className="flex justify-center">
        <h2 className="text-[40px] font-semibold mb-12 mx-auto px-3">
        Our Trusted Sportsbook Partners
      </h2>
      </div>

      {/* MARQUEE — FULL WIDTH, NO GAPS */}
      <div className="w-full overflow-hidden">
        <Marquee
          speed={45}
          pauseOnHover
          autoFill
          gradient={false}
        >
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center px-4"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={160}
                height={80}
                className="object-contain"
                priority
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
