"use client";

export default function FreePicksBanner() {
  return (
    <section className="relative w-full py-20 overflow-hidden">
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
          Today’s Free Picks
        </h2>

        <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
          Get a taste of our expert analysis with these complimentary picks
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div>
            <p className="text-3xl font-bold">6</p>
            <p className="text-sm mt-1">Free Picks Today</p>
          </div>

          <div>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-sm mt-1">Recent Win Rate</p>
          </div>

          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm mt-1">Expert Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
