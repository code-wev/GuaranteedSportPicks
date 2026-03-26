import Image from "next/image";
import {
  FaLock,
  FaCloudSun,
  FaWind,
  FaStar,
  FaTrophy,
  FaFireAlt,
  FaCheck,
} from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiBarChart2Fill } from "react-icons/ri";
import { IoMdSunny } from "react-icons/io";
export default function TodaysFeature() {
  return (
    <div className="min-h-screen bg-[url('/home/todays/todays-feature.jpg')] bg-cover bg-center flex flex-col items-center justify-center p-4 pt-20">
      <div className="text-center text-white mb-8">
        <h1 className="text-[36px] font-semibold mb-2">
          Today&apos;s Featured Expert Pick
        </h1>
        <p className="text-gray-200 text-sm max-w-xl mx-auto">
          Our top analysts have identified today’s best betting opportunity with
          94% confidence
        </p>
      </div>

      <div className="bg-white/14 backdrop-blur-md rounded-2xl shadow-2xl max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#C62828] rounded-t-2xl p-6 text-white mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#FF5252] w-10 h-10 flex justify-center items-center rounded-full">
              <FaTrophy />
            </div>
            <div>
              <p className="text-lg font-medium">NFL Sunday Night</p>
              <p className="text-sm text-gray-200">Expert Confidence: 94%</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm">Game Time</p>
            <p className="font-bold text-lg">8:20 PM ET</p>
          </div>
        </div>

        {/* Matchup */}
        <div className="flex flex-col md:flex-row items-center justify-between text-white mb-6 pt-3">
          <div className="flex flex-col items-center w-1/3 space-y-4">
            <Image
              src="/home/todays/dal.png"
              alt="Dallas Cowboys"
              width={80}
              height={80}
              className="mb-2 rounded-full"
            />
            <h2 className="font-bold text-lg">Dallas Cowboys</h2>
            <p className="px-3 py-1 bg-[#4CAF50] rounded-3xl">-145 Favorite</p>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <p className="text-gray-300 text-3xl my-6">VS</p>
            <div className="bg-[#C62828] text-white px-5 py-2 rounded-full text-sm font-semibold mb-2 flex items-center gap-1">
              <FaFireAlt className="text-[#FDBA74]" />
              EXPERT PICK
            </div>
          </div>

          <div className="flex flex-col items-center w-1/3 space-y-4">
            <Image
              src="/home/todays/ny.png"
              alt="New York Giants"
              width={80}
              height={80}
              className="mb-2 rounded-full"
            />
            <h2 className="font-bold text-lg">New York Giants</h2>
            <p className="px-3 py-1 bg-[#2196F3] rounded-3xl">+135 Underdog</p>
          </div>
        </div>

        {/* Stats + Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 px-8">
          <div className="bg-white/22 rounded-xl p-5">
            <h3 className="font-semibold text-gray-100 mb-2 flex items-center gap-3">
              <RiBarChart2Fill className="text-[#e56f6d]" /> Key Stats
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#4caf50]" />
                Cowboys 7-3 ATS last 10 games
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#4caf50]" />
                Giants struggling on offense (18.2 PPG)
              </li>
              <li className="flex items-center gap-2">
                <FaCheck className="text-[#4caf50]" />
                Dallas defense allows 19.8 PPG
              </li>
            </ul>
          </div>

          <div className="bg-white/22 rounded-xl p-4">
            <h3 className="font-semibold text-gray-100 mb-2 flex items-center gap-3">
              <TiWeatherPartlySunny className="text-red-400" /> Weather &
              Conditions
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center gap-1">
                <IoMdSunny className="text-yellow-400 text-base" />
                Clear skies, 45°F
              </li>
              <li className="flex items-center gap-1">
                <FaWind className="text-sky-500 text-base" /> Light winds (6
                mph)
              </li>
              <li className="flex items-center gap-1">
                <Image
                  src="/home/todays/conditions.png"
                  alt="New York Giants"
                  width={20}
                  height={20}
                />
                Perfect passing conditions
              </li>
            </ul>
          </div>
        </div>

        {/* Unlock Button */}
        <div className="flex flex-col items-center mb-10">
          <button className="bg-[#E53935] hover:from-red-500 hover:to-orange-400 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg transition">
            <FaLock /> Unlock This Pick - $9.99
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center max-w-sm">
            Includes detailed analysis, betting strategy, and live updates.
          </p>
        </div>
      </div>
    </div>
  );
}
