"use client";

import { useState } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

export default function Faq() {
  const faqs = [
    {
      question: "How do I receive my daily picks?",
      answer: "You will receive your daily picks via email every morning at 8 AM."
    },
    {
      question: "What sports do you cover?",
      answer: "We cover football, basketball, baseball, tennis, and more."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription anytime from your account settings."
    },
    {
      question: "Do you offer a money-back guarantee?",
      answer: "Yes, we offer a 7-day money-back guarantee on all subscriptions."
    },
    {
      question: "How accurate are your picks?",
      answer: "Our picks have a historical accuracy of over 75%, but results may vary."
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, we don't have a mobile app, but our website is mobile-friendly."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-2">
          Frequently Asked Questions
        </h2>
        <p className=" mb-10">
          Everything you need to know about our packages
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="w-full border border-gray-300 rounded-md px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2c2c2c] font-bold">
                {faq.question}
              </span>
              {openIndex === index ? (
                <IoRemove size={20} className="text-red-500" />
              ) : (
                <IoAdd size={20} className="text-red-500" />
              )}
            </div>

            {/* Answer section */}
            {openIndex === index && (
              <p className="text-gray-600 mt-2 text-sm">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
