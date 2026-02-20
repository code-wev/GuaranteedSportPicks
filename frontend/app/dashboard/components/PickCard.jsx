import Image from "next/image";
import { FiClock } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";
import { GoEye } from "react-icons/go";

export default function PickCard() {
  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-5">
      <div className="relative flex items-center justify-between mb-3 space-y-4">
        {/* Left team */}
        <div className="flex items-center space-x-2">
          <Image
            src="/dashboard/my-picks/giants.png"
            width={30}
            height={30}
            alt="team"
          />
          <p className="font-semibold text-2xl text-gray-800">Giants</p>
        </div>

        <span className="text-gray-500 font-medium">VS</span>

        {/* Right team */}
        <div className="flex items-center space-x-2">
          <Image
            src="/dashboard/my-picks/giants.png"
            width={30}
            height={30}
            alt="team"
          />
          <p className="font-semibold text-2xl text-gray-800">CowBoy</p>
        </div>

        <span className="absolute -right-6 -top-8 text-sm bg-[#26AB68] text-white px-3 py-1 rounded-full">
          Active
        </span>
      </div>

      {/* Details */}
      <div className="text-sm text-gray-700 mb-4 space-y-4">
        <div className="flex justify-between">
          <div className="">
            <p className="text-[#B1B4B1]">Game Date</p>
            <p>2025-01-20</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-[#B1B4B1]">Bet Type</p>
            <p>Spread</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="">
            <p className="text-[#B1B4B1]">Time</p>
            <p>8:00 PM EST</p>
          </div>
          <div className="">
            <p className="font-semibold text-[#B1B4B1]">Odds</p>
            <p>-145</p>
          </div>
        </div>
      </div>

      {/* Confidence */}
      <div className="mb-3">
        <p className="text-gray-700 font-semibold mb-1">Confidence</p>
        <div className="flex items-center space-x-1 text-[#B91C1C]">
          {[1, 2, 3, 4].map((i) => (
            <AiFillStar key={i} size={20} />
          ))}
          <p className="text-base text-gray-600">4 Units</p>
        </div>
      </div>

      {/* Game Started */}
      <button className="w-full flex items-center justify-center space-x-2 bg-[#FFF3F3] text-[#B91C1C] py-2 rounded-lg mb-4 text-sm font-medium">
        <FiClock className="text-xl" />
        <span>Time remaining: Game Started</span>
      </button>

      {/* View Details */}
      <button className="w-full bg-[#B91C1C] hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2">
        <GoEye className="text-xl"/>
        <span>View Details</span>
      </button>
    </div>
  );
}
