"use client";

const TrackRecordGlance = () => {
  return (
    <section className="w-full bg-[#B91C1C] py-28 text-white">
      <div className="max-w-5xl mx-auto text-center px-4">
        <h2 className="text-2xl md:text-4xl font-semibold">Our Track Record</h2>
        <p className="text-sm mt-2 opacity-90">
          Numbers that speak for themselves
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-12">
          <div>
            <h3 className="text-2xl font-medium">15+</h3>
            <p className="text-sm mt-2 opacity-90">Years Experience</p>
          </div>

          <div>
            <h3 className="text-2xl font-medium">10,000+</h3>
            <p className="text-sm mt-2 opacity-90">Satisfied Clients</p>
          </div>

          <div>
            <h3 className="text-2xl font-medium">85%</h3>
            <p className="text-sm mt-2 opacity-90">Win Rate</p>
          </div>

          <div>
            <h3 className="text-2xl font-medium">24/7</h3>
            <p className="text-sm mt-2 opacity-90">Support Available</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackRecordGlance;