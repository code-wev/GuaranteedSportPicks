"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();

  // Hide Navbar in dashboard routes (assuming all dashboard routes start with "/dashboard")
  // khalid vaiyer pocha code
  // aso khelbo kheladhola sesh kore dashboard e jabo
  if (pathName.includes("/dashboard")) {
    return null;
  }

  const isActive = (path) => pathName === path;

  return (
    <nav className='w-full bg-[#FFEEEE]'>
      <div className='max-w-7xl mx-auto px-6 flex items-center justify-between h-[80px]'>
        {/* Logo */}
        <div className='flex items-center space-x-1'>
          <span className='text-2xl font-extrabold text-[#d93732]'>Sport</span>
          <span className='text-2xl font-extrabold text-[#bfbfbf]'>Picks</span>
        </div>

        {/* Desktop Links */}
        <ul className='hidden lg:flex items-center space-x-6 text-[16px] font-[600] text-[#4B556C]'>
          <li>
            <Link
              href='/'
              className={isActive("/") ? "text-[#d93732] font-semibold" : ""}>
              Home
            </Link>
          </li>

          <li>
            <Link
              href='/about'
              className={
                isActive("/about") ? "text-[#d93732] font-semibold" : ""
              }>
              How It Works
            </Link>
          </li>

          <li>
            <Link
              href='/freepicks'
              className={
                isActive("/freepicks") ? "text-[#d93732] font-semibold" : ""
              }>
              Free Picks
            </Link>
          </li>

          <li>
            <Link
              href='/packages'
              className={
                isActive("/packages") ? "text-[#d93732] font-semibold" : ""
              }>
              Packages
            </Link>
          </li>

          <li>
            <Link
              href='/blog'
              className={
                isActive("/blog") ? "text-[#d93732] font-semibold" : ""
              }>
              Betting News
            </Link>
          </li>

          <li>
            <Link
              href='/contact'
              className={
                isActive("/contact") ? "text-[#d93732] font-semibold" : ""
              }>
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className='hidden lg:flex items-center space-x-4 text-[14px]'>
          <Link href='/login' className='text-[#374151] font-medium'>
            Login
          </Link>
          <span className='text-[#999]'>/</span>
          <Link href='signup' className='text-[#374151] font-medium'>
            Register
          </Link>

          <Link
            href='#'
            className='ml-4 bg-[#d93732] text-white  px-3 py-2 lg:px-5 lg:py-3 rounded lg:rounded-full text-xs font-semibold hover:bg-[#c22f2b] transition'>
            Get Picks Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='lg:hidden flex items-center text-[#4B556C]'
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Toggle Menu'>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className='lg:hidden bg-[#FFEEEE] border-t border-[#6b5a59]'>
          <ul className='flex flex-col space-y-4 py-4 px-6 text-[16px] font-[600] text-[#4B556C]'>
            <li>
              <Link
                href='/'
                className={isActive("/") ? "text-[#d93732] font-semibold" : ""}
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            <li>
              <Link
                href='/about'
                className={
                  isActive("/about") ? "text-[#d93732] font-semibold" : ""
                }
                onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>

            <li>
              <Link
                href='/freepicks'
                className={
                  isActive("/freepicks") ? "text-[#d93732] font-semibold" : ""
                }
                onClick={() => setIsOpen(false)}>
                Free Picks
              </Link>
            </li>

            <li>
              <Link
                href='/packages'
                className={
                  isActive("/packages") ? "text-[#d93732] font-semibold" : ""
                }
                onClick={() => setIsOpen(false)}>
                Packages
              </Link>
            </li>

            <li>
              <Link
                href='/blog'
                className={
                  isActive("/blog") ? "text-[#d93732] font-semibold" : ""
                }
                onClick={() => setIsOpen(false)}>
                Blog
              </Link>
            </li>

            <li>
              <Link
                href='/contact'
                className={
                  isActive("/contact") ? "text-[#d93732] font-semibold" : ""
                }
                onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>

            <div className='flex items-center space-x-2 pt-4 border-t border-[#d9d9d9]'>
              <Link href='/login' className='text-[#374151] font-medium'>
                Login
              </Link>
              <span className='text-[#999]'>/</span>
              <Link href='signup' className='text-[#374151] font-medium'>
                Register
              </Link>
            </div>

            <Link
              href='#'
              className='bg-[#d93732] text-white w-full text-center px-4 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-full text-xs font-semibold hover:bg-[#c22f2b] transition'
              onClick={() => setIsOpen(false)}>
              Get Picks Now
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
}
