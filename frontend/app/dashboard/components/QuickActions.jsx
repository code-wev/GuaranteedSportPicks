import { FiShoppingCart, FiEye, FiClock } from "react-icons/fi";

export default function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold mb-4 text-xl">Quick Action</h3>

      <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-6">
        {/* Buy New Pick */}
        <button className="flex items-center gap-2 bg-[#D32F2F] text-white w-full md:w-1/3 py-3 rounded-lg justify-center">
          <FiShoppingCart /> Buy New Pick
        </button>

        {/* View Active Pick */}
        <button className="flex items-center gap-2 text-red-600 border w-full md:w-1/3 py-3 rounded-lg justify-center">
          <FiEye /> View Active Pick
        </button>

        {/* Purchase History */}
        <button className="flex items-center gap-2 text-red-600 border w-full md:w-1/3 py-3 rounded-lg justify-center">
          <FiClock /> Purchase History
        </button>
      </div>
    </div>
  );
}
