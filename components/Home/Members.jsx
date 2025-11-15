"use client";

import Image from "next/image";

export default function Members() {
  const testimonials = [
    {
      img: "/home/members/pic1.jpg",
      name: "Michael Anderson",
      role: "Real Estate Photographer",
      text: "BetPro transformed my betting from guesswork to a profitable business. I've made over $50,000 in the past 6 months following their picks.",
      date: "June 15, 2025",
    },
    {
      img: "/home/members/pic2.jpg",
      name: "Sarah Johnson",
      role: "Real Estate Photographer",
      text: "The detailed analysis and real-time updates are incredible. My win rate went from 45% to 82% in just two months. Absolutely worth every penny.",
      date: "June 15, 2025",
    },
    {
      img: "/home/members/pic3.jpg",
      name: "David Thomson",
      role: "Real Estate Photographer",
      text: "I used to lose money at casinos. Now with BetPro’s expert picks, I’ve turned sports betting into my side income. Best investment I’ve ever made.",
      date: "June 15, 2025",
    },
  ];

  return (
    <section
      className="relative w-full bg-white bg-cover bg-center bg-no-repeat py-16 md:py-20 overflow-hidden"
      style={{ backgroundImage: "url('/home/LatestBetting/BgImg.png')" }}
    >
      {/* ----- Top Heading ----- */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What Our Members Say
        </h2>
        <p className="text-gray-600 mt-2 w-3/6 mx-auto">
          Join thousands of successful bettors who have transformed their
          betting with our expert picks
        </p>
      </div>

      {/* ----- Testimonials Cards ----- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-[#FFF5F5] rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Image
                src={t.img}
                width={50}
                height={50}
                alt={t.name}
                className="rounded-full"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{t.name}</h4>
                <p className="text-gray-500 text-sm">{t.role}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex mt-3 text-yellow-500">{"★★★★★"}</div>

            <p className="text-gray-700 mt-3 text-sm leading-relaxed">
              {t.text}
            </p>

            <p className="text-gray-400 text-sm mt-4">{t.date}</p>
          </div>
        ))}
      </div>

      {/* ----- Bottom CTA Box ----- */}
      <div className="max-w-3xl mx-auto mt-16 bg-transparent  rounded-2xl p-10 text-center shadow-sm border border-red-100">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
          Ready to Join Our Winning Community?
        </h3>
        <p className="text-gray-600 mt-2">
          Over 10,000 members have already started their profitable betting
          journey
        </p>
      </div>
      <button className="mt-6 bg-[#E53935] text-white px-6 py-3 rounded-full text-sm font-medium shadow hover:bg-red-600 transition mx-auto block">
        Start Winning Today
      </button>
    </section>
  );
}
