"use client";

import Image from "next/image";

const testimonials = [
  {
    name: "Michael Anderson",
    role: "Real Estate Photographer",
    stars: 5,
    avatar: "/home/members/pic1.jpg", // replace with actual image path
    text: `"BetPro transformed my betting from guesswork to a profitable business. I've made over $50,000 in the past 6 months following their picks."`,
    date: "June 15, 2025",
  },
  {
    name: "Sarah Johnson",
    role: "Real Estate Photographer",
    stars: 5,
    avatar: "/home/members/pic2.jpg",
    text: `"The detailed analysis and real-time updates are incredible. My win rate went from 45% to 82% in just two months. Absolutely worth every penny."`,
    date: "June 15, 2025",
  },
  {
    name: "David Thomson",
    role: "Real Estate Photographer",
    stars: 5,
    avatar: "/home/members/pic3.jpg",
    text: `"I used to lose money at casinos. Now with BetPro's expert picks, I've turned sports betting into my side income. Best investment I've ever made."`,
    date: "June 15, 2025",
  },
];

export default function Members() {
  return (
    <section className="relative w-full bg-white py-20 mb-96">
      <div className="w-full mx-auto px-4 text-center  bg-[url('/home/members/bg.png')] bg-cover bg-end h-[300px]">
        {/* Heading */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-2">What Our Members Say</h2>
          <p className="text-gray-500 mb-12">
            Join thousands of successful bettors who have transformed their
            betting with our expert picks
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-[#FFF5F5] shadow-lg rounded-xl p-6 text-left"
            >
              <div className="flex items-center mb-4">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {"★".repeat(item.stars)}
              </div>
              <p className="text-gray-600 mb-4">{item.text}</p>
              <p className="text-gray-400 text-sm">{item.date}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="absolute -bottom-60 left-1/2 text-black backdrop-blur-md -translate-x-1/2 -translate-y-1/2 rounded-xl py-12 px-8 text-center">
          <h3 className="text-2xl font-bold mb-2">
            Ready to Join Our Winning Community?
          </h3>
          <p className=" mb-6">
            Over 10,000 members have already started their profitable betting
            journey
          </p>
        </div>

        <button className="border bg-[#F3F4F6] mt-30 text-red-600 font-semibold py-4 px-6 rounded-full hover:bg-gray-100 transition">
          Start Winning Today
        </button>
      </div>
    </section>
  );
}
