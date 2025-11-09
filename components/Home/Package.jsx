"use client";

import { FaCheckCircle } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function Package() {
  const plans = [
    {
      title: "Daily Pass",
      subtitle: "Perfect for testing our service",
      price: "$9.99",
      features: [
        "1 Expert Pick",
        "Detailed Analysis",
        "Live Updates",
        "Basic Support",
      ],
      buttonColor: "bg-gray-200 text-black",
    },
    {
      title: "Daily Pass",
      subtitle: "Best value for consistent winners",
      price: "$49.99",
      features: [
        "7 Expert Picks",
        "Premium Analysis",
        "Live Chat Support",
        "Profit Tracking",
        "Mobile Alerts",
      ],
      buttonColor: "bg-red-600 text-white",
    },
    {
      title: "Daily Pass",
      subtitle: "Best value for consistent winners",
      price: "$149.99",
      features: [
        "Networked note-taking",
        "Kindle offline sync",
        "End to end encryption",
        "Kindle highlights sync",
      ],
      buttonColor: "bg-gray-200 text-black",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="relative w-full bg-[url('/home/package/package-bg3.jpg')] bg-center bg-no-repeat py-16 text-center">
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <Image
          src="/home/package/chakti.png"
          alt="Center Icon"
          width={1188}
          height={180}
        />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-black">
        Choose Your Winning Package
      </h2>
      <p className="text-gray-600 mt-2 mb-12 max-w-2xl mx-auto">
        From casual bettors to professional gamblers, we have the perfect plan
        for your success
      </p>

      <div className="max-w-6xl mx-auto px-4">
        <Slider {...settings}>
          {plans.map((plan, idx) => (
            <div key={idx} className="px-3">
              <div className="bg-[#0d0d0d] rounded-3xl text-white p-8 flex flex-col justify-between shadow-[0_0_30px_#ff000025]">
                <div>
                  <h3 className="text-2xl font-semibold">{plan.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{plan.subtitle}</p>
                  <p className="text-4xl font-bold mt-6">{plan.price}</p>
                  <hr className="border-gray-700 my-6" />
                  <ul className="space-y-3 text-gray-300 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FaCheckCircle className="text-red-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className={`mt-8 w-full py-3 rounded-full font-medium ${plan.buttonColor} transition hover:opacity-90`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="mt-20">
        <button className="bg-[#E53935] text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition">
          Experience the Difference Today
        </button>
      </div>
    </section>
  );
}
