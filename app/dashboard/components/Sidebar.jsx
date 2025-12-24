"use client";

import { FiGrid, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { RiFileHistoryFill } from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoDocumentTextOutline } from "react-icons/io5";
import { GrUserAdmin } from "react-icons/gr";

const menu = [
  { title: "Dashboard", icon: <FiGrid />, url: "/dashboard" },
  { title: "Admin Dashboard", icon: <GrUserAdmin />, url: "/dashboard/admin" },
  {
    title: "Manage picks",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/manage-picks",
  },
  {
    title: "Users",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/users",
  },
  {
    title: "Orders",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/orders",
  },
  {
    title: "Blogs",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/blogs",
  },
  {
    title: "Testimonials",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/testimonials",
  },
  {
    title: "Affiliate",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/affiliate",
  },
  {
    title: "Newsletters",
    icon: <IoDocumentTextOutline />,
    url: "/dashboard/admin/newsletters",
  },
  { title: "My Picks", icon: <FiShoppingBag />, url: "/dashboard/my-picks" },
  {
    title: "Purchase Picks",
    icon: <FiShoppingBag />,
    url: "/dashboard/purchase",
  },
  {
    title: "Purchase history",
    icon: <RiFileHistoryFill />,
    url: "/dashboard/purchase-history",
  },
  { title: "Profile & Settings", icon: <FiUser />, url: "/dashboard/profile" },
];

export default function Sidebar({ open, setOpen }) {
  const path = usePathname();

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
        className={`fixed top-0 left-0 w-64 bg-white shadow-xl p-5 z-50 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static`}
      >
        {/* Close button for mobile */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <Link href="/">
            <Image
              src="/dashboard/SportPicks.png"
              width={120}
              height={40}
              alt="logo"
            />
          </Link>
          <FiX
            className="text-2xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Desktop Logo */}
        <Link href="/">
          <Image
            src="/dashboard/SportPicks.png"
            width={150}
            height={40}
            alt="logo"
            className="mb-6 hidden lg:block"
          />
        </Link>

        <ul className="space-y-2 pt-4">
          {menu.map((item, index) => {
            const isActive = path === item.url;

            return (
              <Link key={index} href={item.url} onClick={() => setOpen(false)}>
                <li
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition
                    ${
                      isActive
                        ? "bg-red-50 text-red-600 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.title}
                </li>
              </Link>
            );
          })}
        </ul>
      </aside>
    </>
  );
}
