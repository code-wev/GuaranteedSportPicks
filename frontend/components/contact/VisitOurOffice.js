"use client";

import Image from "next/image";

const VisitOurOffice = () => {
  return (
    <section className="w-full py-20 bg-[#F9FAFB] pt-28">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
          Visit Our Office
        </h2>

        <p className="text-sm md:text-xl mt-3 leading-relaxed">
          Located in the heart of Las Vegas, our team of sports analysts work
          around the clock to bring you the best picks.
        </p>

        <div className="mt-10 w-full rounded-2xl overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.1)]">
          <Image
            src="/map.png" // Replace with your map image
            alt="Office Location"
            width={1200}
            height={433}
            className="w-full h-[433px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default VisitOurOffice;
