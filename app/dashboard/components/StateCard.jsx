import { FiBarChart2, FiCreditCard, FiTrendingUp, FiBookmark } from "react-icons/fi";
import { IoTrophyOutline } from "react-icons/io5";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { RiBarChartFill } from "react-icons/ri";

const icons = {
  pick: <FiBookmark />,
  win: <IoTrophyOutline />,
  rate: <RiBarChartFill  />,
  wallet: <MdOutlineAccountBalanceWallet  />,
};

export default function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm">
      <h4 className="text-gray-600">{title}</h4>

      <div className="flex items-center justify-between mt-2">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="text-red-500 text-2xl">{icons[icon]}</span>
      </div>

      <p className="text-sm text-green-600 mt-2">{change}</p>
    </div>
  );
}
