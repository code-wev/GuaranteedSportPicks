"use client";

const faqs = [
  {
    q: "How quickly will I receive a response?",
    a: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our phone support line. Can I schedule a consultation call?",
  },
  {
    q: "Can I schedule a consultation call?",
    a: "Yes! Premium and VIP subscribers can schedule one-on-one consultation calls with our expert analysts. Contact us to arrange a session. Do you offer refunds?",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a 7-day money-back guarantee for all new subscribers. If you're not satisfied with our service, contact us for a full refund.",
  },
  {
    q: "How can I update my subscription?",
    a: "You can upgrade or downgrade your subscription at any time by contacting our support team. Changes take effect immediately.",
  },
];

const FAQContact = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#1A1A1A]">
          Frequently Asked Questions
        </h2>

        <p className="text-sm md:text-base mt-2">
          Quick answers to common questions about our services
        </p>

        <div className="mt-10 space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-[0_3px_10px_rgba(0,0,0,0.08)] text-left"
            >
              <p className="font-semibold text-base md:text-2xl text-gray-900">
                {faq.q}
              </p>
              <p className="text-gray-600 mt-2 text-sm md:text-xl leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>  
      </div>
    </section>
  );
};

export default FAQContact;
