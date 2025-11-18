"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#FFEEEE] border-b border-[#6b5a59]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[80px]">
        {/* Left - Logo */}
        <div className="flex items-center space-x-1">
          <span className="text-2xl font-extrabold text-[#d93732]">Sport</span>
          <span className="text-2xl font-extrabold text-[#bfbfbf]">Picks</span>
        </div>

        {/* Middle - Nav links (Desktop) */}
        <ul className="hidden md:flex items-center space-x-6 text-[16px] font-[600] text-[#4B556C]">
          <li>
            <Link href="/" className="text-[#d93732] font-semibold">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/free-pics">Free Picks</Link>
          </li>
          <li>
            <Link href="/packages">Packages</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>

        {/* Right - Login/Register + Button (Desktop) */}
        <div className="hidden md:flex items-center space-x-4 text-[14px]">
          <Link href="#" className="text-[#374151] font-medium">
            Login
          </Link>
          <span className="text-[#999]">/</span>
          <Link href="#" className="text-[#374151] font-medium">
            Register
          </Link>

          <Link
            href="#"
            className="ml-4 bg-[#d93732] text-white px-5 py-3 rounded-full text-xs font-semibold hover:bg-[#c22f2b] transition"
          >
            Get Picks Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-[#4B556C]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FFEEEE] border-t border-[#6b5a59]">
          <ul className="flex flex-col space-y-4 py-4 px-6 text-[16px] font-[600] text-[#4B556C]">
            <li>
              <Link
                href="/"
                className=" font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                Free Picks
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                Packages
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>

            <div className="flex items-center space-x-2 pt-4 border-t border-[#d9d9d9]">
              <Link href="#" className="text-[#374151] font-medium">
                Login
              </Link>
              <span className="text-[#999]">/</span>
              <Link href="#" className="text-[#374151] font-medium">
                Register
              </Link>
            </div>

            <Link
              href="#"
              className="bg-[#d93732] text-white w-full text-center px-5 py-3 rounded-full text-xs font-semibold hover:bg-[#c22f2b] transition"
              onClick={() => setIsOpen(false)}
            >
              Get Picks Now
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
}
