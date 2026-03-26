"use client";

import { HiOutlineMail } from "react-icons/hi";
import { FiPhoneCall } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineAccessTime } from "react-icons/md";

const ContactForm = () => {
  return (
    <section className="w-full py-18 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: FORM */}
        <div className="bg-white rounded-lg shadow-[0_3px_12px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* HEADER */}
          <div className="bg-[#B91C1C] px-6 py-4">
            <h2 className="text-lg md:text-2xl font-semibold text-white">
              Send us a Message
            </h2>
          </div>

          {/* FORM BODY */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#4B556C]">
                  Full Name*
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full  rounded-lg border border-[#D4D4D4] px-3 py-3 bg-[#F5F5F5] text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#4B556C]">
                  Email Address*
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full    rounded-lg border border-[#D4D4D4] bg-[#F5F5F5] px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#4B556C]">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  className="w-full  rounded-lg border border-[#D4D4D4] bg-[#F5F5F5] px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#4B556C]">
                  Subject*
                </label>
                <select className="w-full  rounded-lg border border-[#D4D4D4] bg-[#F5F5F5] px-3 py-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400">
                  <option>Select your subject</option>
                </select>
              </div>
            </div>

            {/* MESSAGE BOX */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-1 text-[#4B556C]">
                Message*
              </label>
              <textarea
                placeholder="Tell us how we can help you..."
                maxLength={500}
                className="w-full h-32 rounded-md border border-[#D4D4D4] bg-[#F5F5F5] px-3 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-400"
              ></textarea>
              <p className="text-right text-base text-[#4B556C] font-medium">
                0/500 characters
              </p>
            </div>

            {/* SUBMIT BUTTON */}
            <button className="w-full bg-[#B91C1C] hover:bg-[#B02020] transition text-white mt-6 py-3 rounded-md font-medium">
              Send Message
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white p-7 rounded-xl shadow-[0_3px_12px_rgba(0,0,0,0.12)]">
          <h3 className="text-2xl font-semibold">
            Contact Information
          </h3>
          <p className="text-xl text-gray-600 mt-2 leading-relaxed">
            Ready to take your betting to the next level? Get in touch with our
            expert team for personalized support and guidance.
          </p>

          <div className="mt-6 space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#B91C1C] w-10 h-10  rounded-md flex justify-center items-center">
                <HiOutlineMail className="text-white text-2xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email Support</p>
                <p className="text-sm text-gray-600">support@sportspicks.com</p>
                <p className="text-xs text-gray-500">
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#B91C1C] w-10 h-10 rounded-md flex justify-center items-center">
                <FiPhoneCall className="text-white text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Phone Support</p>
                <p className="text-sm text-gray-600">+1 (555) 123-PICK</p>
                <p className="text-xs text-gray-500">Mon-Fri: 9AM-8PM EST</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="bg-[#B91C1C] w-10 h-10  rounded-md flex justify-center items-center">
                <IoLocationOutline className="text-white text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Office Location</p>
                <p className="text-sm text-gray-600">
                  123 Sports Analytics Blvd
                </p>
                <p className="text-xs text-gray-500">Las Vegas, NV 89101</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-[#B91C1C] w-10 h-10 rounded-md flex justify-center items-center">
                <MdOutlineAccessTime className="text-white text-xl" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Business Hours</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Monday - Friday: 9:00 AM - 8:00 PM EST
                  </p>
                  <p className="text-sm text-gray-600">
                    Saturday: 10:00 AM - 6:00 PM EST
                  </p>
                  <p className="text-sm text-gray-600">
                    Sunday: 12:00 PM - 5:00 PM EST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
