"use client";
import { useState } from "react";
import { RiExchangeDollarLine } from "react-icons/ri";
import { PiShieldCheckBold } from "react-icons/pi";
import { AiOutlineInfoCircle } from "react-icons/ai";

export default function PaymentModel() {
  const [activeTab, setActiveTab] = useState("prepaid");

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm mb-8">
      <h2 className="text-lg font-medium mb-4">Payment Model</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Prepaid */}
        <div
          onClick={() => setActiveTab("prepaid")}
          className={`border rounded-xl space-y-2 p-4 py-8 cursor-pointer 
            ${
              activeTab === "prepaid"
                ? "bg-red-50 border-red-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
        >
          <p
            className={`font-semibold flex items-center gap-2 text-2xl
            ${activeTab === "prepaid" ? "text-[#B91C1C]" : "text-black"}`}
          >
            <RiExchangeDollarLine className="text-2xl" /> Prepaid
          </p>
          <p
            className={`text-xl 
            ${activeTab === "prepaid" ? "text-[#bb2a2a]" : "text-gray-600"}`}
          >
            Pay upfront and get instant access to picks
          </p>
        </div>

        {/* Pay After You Win */}
        <div
          onClick={() => setActiveTab("payafter")}
          className={`border rounded-xl p-4 py-8 cursor-pointer space-y-2 
            ${
              activeTab === "payafter"
                ? "bg-red-50 border-red-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
        >
          <p
            className={`font-semibold flex items-center gap-2 text-2xl
            ${activeTab === "payafter" ? "text-[#B91C1C]" : "text-black"}`}
          >
            <PiShieldCheckBold /> Pay After You Win
            <span className="text-lg bg-[#26AB68] text-white px-4 py-1.5 rounded-full">
              Popular
            </span>
          </p>
          <p
            className={`text-xl ${
              activeTab === "payafter" ? "text-[#bb2a2a]" : "text-gray-600"
            }`}
          >
            Pay after winning your picks
          </p>
        </div>
      </div>

      {/* Conditional Info Box */}
      {activeTab === "payafter" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-[#1D4EDB]">
          <div className="flex items-start gap-2">
            <AiOutlineInfoCircle className="text-3xl"/>
            <h3 className="font-semibold mb-2 text-2xl">How Pay After you Win Works</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-10">
            <li>We Place an authorization hold your card (No Change)</li>
            <li>You get instant access to the pick</li>
            <li>If the pick wins, we capture the payment</li>
            <li>If the pick loses, the hold is released (No Change)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
