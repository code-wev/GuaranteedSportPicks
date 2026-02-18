"use client";

const MissionPromise = () => {
  return (
    <section className="w-full py-20 bg-[#F7F8FA]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 px-4">

        {/* OUR MISSION */}
        <div className="relative">
          {/* Red vertical line */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#C62626] rounded-full"></div>

          <div className="pl-6">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-4">
              Our Mission
            </h3>

            <p className="text-sm md:text-base leading-relaxed mb-4">
              To democratize professional sports betting knowledge and provide our
              clients with the same level of analysis and insights that professional
              bettors use to generate consistent profits.
            </p>

            <p className="text-sm md:text-base leading-relaxed">
              We believe that with the right information, strategy, and discipline,
              anyone can become a successful sports bettor. Our mission is to be your
              trusted partner in this journey.
            </p>
          </div>
        </div>

        {/* OUR PROMISE */}
        <div className="relative">
          <div className="absolute left-0 top-0 h-full w-1.5 bg-[#C62626] rounded-full"></div>

          <div className="pl-6">
            <h3 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] mb-4">
              Our Promise
            </h3>

            <p className="text-sm md:text-base leading-relaxed mb-4">
              We promise to deliver honest, transparent, and data-driven sports betting
              advice. Every pick we make is backed by thorough research, statistical
              analysis, and years of experience.
            </p>

            <p className="text-sm md:text-base leading-relaxed">
              We track all our results publicly and stand behind our recommendations.
              Your success is our success, and we’re committed to helping you achieve
              your betting goals.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionPromise;
