import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { useMyProfileQuery } from "@/feature/UserApi";

export default function DashNavbar({ setOpen }) {
  const router = useRouter();
  const { data } = useMyProfileQuery();
  const user = data?.data;
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() || "User";

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

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
        <Link
          href="/dashboard/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          <FiShoppingCart />
          Cart
        </Link>
        <span className="font-medium">{fullName}</span>
        <Image
          src="/dashboard/profile.png"
          width={40}
          height={40} 
          className="rounded-full"
          alt="profile"
        />
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg px-3 py-2 hover:bg-red-50"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}
