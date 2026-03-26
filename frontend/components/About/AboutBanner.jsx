"use client";

export default function AboutBanner() {
  return (
    <section className="relative w-full overflow-hidden py-32">
      {/* Your background image ONLY */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/home/homeBannerBg.png')",
        }}
      />

      {/* Diagonal light streaks */}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-3">
          About Our Expert Team
        </h2>

        <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
          Dedicated professionals delivering winning sports betting insights
          since 2008
        </p>
      </div>
    </section>
  );
}
