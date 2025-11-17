import { FiLock, FiRotateCw, FiHeadphones } from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { TfiReload } from "react-icons/tfi";
import { SlEarphonesAlt } from "react-icons/sl";


export default function CTA() {
  return (
    <section className="w-full bg-[#C02222] py-20 text-center text-white">
      <h2 className="text-4xl font-semibold mb-2">Ready to Start Winning?</h2>

      <p className="text-xl mb-8 text-red-100">
        Join thousands of successful bettors who trust our expert picks.
        <br />
        Choose your package and start your winning streak today
      </p>

      <div className="flex items-center justify-center gap-4 mb-8">
        <button className="bg-white text-[#B91C1C] px-6 py-3 rounded-md font-semibold text-sm shadow">
          View All Packages
        </button>
      </div>

      <div className="flex items-center justify-center gap-8 text-sm text-red-100">
        <div className="flex items-center gap-2">
          <IoShieldCheckmarkOutline size={16} /> Secure Payment
        </div>

        <div className="flex items-center gap-2">
          <TfiReload  size={16} /> Cancel Anytime
        </div>

        <div className="flex items-center gap-2">
          <SlEarphonesAlt  size={16} /> 24/7 Support
        </div>
      </div>
    </section>
  );
}
