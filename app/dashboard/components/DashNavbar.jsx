import Image from "next/image";
import { FiMenu } from "react-icons/fi";

export default function DashNavbar({ setOpen }) {
  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 ml-6">
      {/* Hamburger menu button for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden text-2xl text-gray-700"
      >
        <FiMenu />
      </button>

      {/* Right Profile */}
      <div className="flex items-center gap-3 ml-auto">
        <span className="font-medium">Tamim</span>
        <Image
          src="/dashboard/profile.png"
          width={40}
          height={40} 
          className="rounded-full"
          alt="profile"
        />
      </div>
    </div>
  );
}
