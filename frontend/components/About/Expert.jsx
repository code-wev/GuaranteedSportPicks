"use client";

import Image from "next/image";

const experts = [
  {
    name: "Michael Rodriguez",
    role: "Senior Sports Analyst",
    exp: "12 Years Experience",
    spec: "Specialty: NFL & NBA",
    img: "/about/expert1.png",
  },
  {
    name: "Sarah Thompson",
    role: "Lead Handicapper",
    exp: "8 Years Experience",
    spec: "Specialty: MLB & Soccer",
    img: "/about/expert2.png",
  },
  {
    name: "David Chen",
    role: "Data Analytics Expert",
    exp: "10 Years Experience",
    spec: "Specialty: Statistical",
    img: "/about/expert3.png",
  },
  {
    name: "Jessica Martinez",
    role: "Research Director",
    exp: "Years Experience",
    spec: "Specialty: Sports",
    img: "/about/expert4.png",
  },
];

const Expert = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#111]">
          Meet Our Expert Cappers
        </h2>
        <p className="text-sm mt-2">
          The professionals behind our winning strategies
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {experts.map((ex, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-xl p-2 text-center hover:shadow-2xl transition"
            >
              <div className="w-[120px] h-[120px] mx-auto mb-4 rounded-full overflow-hidden">
                <Image
                  src={ex.img}
                  width={100}
                  height={100}
                  alt={ex.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <h3 className="font-semibold text-gray-900 text-sm md:text-xl">
                {ex.name}
              </h3>

              <p className="text-[#BA1E1E] text-sm mt-1 font-medium">{ex.role}</p>

              <p className="text-gray-600 text-sm mt-3">{ex.exp}</p>
              <p className="text-gray-600 text-sm">{ex.spec}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expert;