import { FiGrid, FiShoppingBag, FiHistory, FiUser, FiX } from "react-icons/fi";
import Image from "next/image";
import { RiFileHistoryFill } from "react-icons/ri";

const menu = [
  { title: "Dashboard", icon: <FiGrid />, active: true },
  { title: "My Picks", icon: <FiShoppingBag /> },
  { title: "Purchase Picks", icon: <FiShoppingBag /> },
  { title: "Purchase history", icon: <RiFileHistoryFill /> },
  { title: "Profile & Settings", icon: <FiUser /> },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 min-h-screen bg-white shadow-xl p-5 z-50 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static`}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <Image src="/logo.png" width={120} height={40} alt="logo" />
          <FiX
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <Image
          src="/dashboard/SportPicks.png"
          width={150}
          height={40}
          alt="logo"
          className="mb-6 hidden lg:block"
        />

        <ul className="space-y-2">
          {menu.map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer 
              ${item.active ? "bg-red-50 text-red-600 font-semibold" : "hover:bg-gray-100"}`}
            >
              <span className="text-xl">{item.icon}</span> {item.title}
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
