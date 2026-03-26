"use client";

export default function WinningBanner() {
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
          Choose Your Winning Package
        </h2>

        <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto">
          Get access to our premium sports betting picks and analysis. Choose the
          plan that fits your betting strategy and start winning today.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12">
          <div>
            <p className="text-3xl font-bold">#1</p>
            <p className="text-sm mt-1">Rated Service</p>
          </div>

          <div>
            <p className="text-3xl font-bold">85%</p>
            <p className="text-sm mt-1">Win Rate</p>
          </div>

          <div>
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-sm mt-1">Support</p>
          </div>
        </div>
      </div>

    </section>
  );
}
