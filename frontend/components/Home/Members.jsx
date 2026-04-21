"use client";

import { useGetApprovedTestimonialsQuery } from "@/feature/TestimonialApi";
import { useRouter } from "next/navigation";

const fallbackTestimonials = [
  {
    _id: "fallback-1",
    name: "Winning Member",
    title: "Premium Subscriber",
    review:
      "BetPro transformed my betting from guesswork into a much more disciplined process. The daily breakdowns have been a huge help.",
    createdAt: "2025-06-15T00:00:00.000Z",
    rating: 5,
  },
  {
    _id: "fallback-2",
    name: "Sharp Bettor",
    title: "Weekend Player",
    review:
      "The detailed analysis and real-time updates are excellent. I finally feel like I have a real edge instead of just guessing.",
    createdAt: "2025-06-15T00:00:00.000Z",
    rating: 5,
  },
  {
    _id: "fallback-3",
    name: "Daily Picks User",
    title: "Long-term Member",
    review:
      "I used to chase random picks. Now I follow a much smarter routine, and the consistency has made the biggest difference for me.",
    createdAt: "2025-06-15T00:00:00.000Z",
    rating: 5,
  },
];

export default function Members() {
  const router = useRouter();
  const { data } = useGetApprovedTestimonialsQuery();
  const testimonials = (
    data?.data?.length ? data.data : fallbackTestimonials
  ).slice(0, 3);

  return (
    <section
      className='relative w-full bg-white bg-cover bg-center bg-no-repeat py-16 md:py-20 overflow-hidden'
      style={{ backgroundImage: "url('/home/LatestBetting/BgImg.png')" }}>
      <div className='text-center mb-14'>
        <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>
          What Our Members Say
        </h2>
        <p className='text-gray-600 mt-2 w-3/6 mx-auto'>
          Join thousands of successful bettors who have transformed their
          betting with our expert picks
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto'>
        {testimonials.map((item) => (
          <div
            key={item._id}
            className='bg-[#FFF5F5] rounded-2xl shadow-lg p-6 border border-gray-100'>
            <div className='flex items-center gap-3'>
              <div className='w-[50px] h-[50px] rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg'>
                {item.name?.slice(0, 1) || "U"}
              </div>
              <div>
                <h4 className='font-semibold text-gray-900'>{item.name}</h4>
                <p className='text-gray-500 text-sm'>
                  {item.title || "Verified Member"}
                </p>
              </div>
            </div>

            <div className='flex mt-3 text-yellow-500'>
              {"★".repeat(item.rating || 5)}
            </div>

            <p className='text-gray-700 mt-3 text-sm leading-relaxed'>
              {item.review}
            </p>

            <p className='text-gray-400 text-sm mt-4'>
              {new Date(item.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        ))}
      </div>

      <div className='max-w-3xl mx-auto mt-16 bg-transparent rounded-2xl p-10 text-center shadow-sm border border-red-100'>
        <h3 className='text-xl md:text-2xl font-semibold text-gray-900'>
          Ready to Join Our Winning Community?
        </h3>
        <p className='text-gray-600 mt-2'>
          Over 10,000 members have already started their profitable betting
          journey
        </p>
      </div>
      <button
        onClick={() => router.push("/signup")}
        className='mt-6 bg-[#E53935] text-white px-6 py-3 rounded-full text-sm font-medium shadow hover:bg-red-600 transition mx-auto block'>
        Start Winning Today
      </button>
    </section>
  );
}
