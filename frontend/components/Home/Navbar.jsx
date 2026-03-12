/* eslint-disable @next/next/no-img-element */
"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLayout, FiLogOut, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const pathName = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, [pathName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setProfileOpen(false);
    setIsOpen(false);
    window.location.href = "/login";
  };

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
        <Link href='/'>
          <div className='flex items-center space-x-1'>
            <span className='text-2xl font-extrabold text-[#d93732]'>
              Sport
            </span>
            <span className='text-2xl font-extrabold text-[#bfbfbf]'>
              Picks
            </span>
          </div>
        </Link>

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
          {!isLoggedIn ? (
            <>
              <Link href='/login' className='text-[#374151] font-medium'>
                Login
              </Link>
              <span className='text-[#999]'>/</span>
              <Link href='signup' className='text-[#374151] font-medium'>
                Register
              </Link>
            </>
          ) : (
            <div className='relative' ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='group flex items-center gap-3 rounded-full border border-[#f0d1d1] bg-white pl-1.5 pr-3 py-1.5 shadow-[0_8px_24px_rgba(185,28,28,0.10)] hover:shadow-[0_10px_28px_rgba(185,28,28,0.16)] transition-all duration-200'>
                <div className='relative shrink-0'>
                  <img
                    src='/avatar.png'
                    alt='Profile Avatar'
                    className='w-11 h-11 rounded-full object-cover border-2 border-white ring-2 ring-[#ffd9d9]'
                  />
                  <span className='absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white'></span>
                </div>

                <div className='flex flex-col items-start leading-tight'>
                  <span className='text-[10px] font-bold uppercase tracking-[0.14em] text-[#b08989]'>
                    Account
                  </span>
                  <span className='text-sm font-semibold text-[#374151]'>
                    My Profile
                  </span>
                </div>

                <FiChevronDown
                  size={16}
                  className={`text-[#7b8089] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className='absolute right-0 mt-3 w-60 overflow-hidden rounded-3xl border border-[#f2dddd] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] z-50'>
                  <div className='bg-gradient-to-br from-[#fff7f7] to-[#fffefe] px-4 py-4 border-b border-[#f6e6e6]'>
                    <div className='flex items-center gap-3'>
                      <img
                        src='/avatar.png'
                        alt='Profile Avatar'
                        className='w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-[#ffd9d9]'
                      />
                      <div>
                        <p className='text-sm font-bold text-[#1f2937]'>
                          Welcome Back
                        </p>
                        <p className='text-xs text-[#6b7280]'>
                          Access your account
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='p-2'>
                    <Link
                      href='/dashboard'
                      className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#374151] hover:bg-[#fff5f5] transition'
                      onClick={() => setProfileOpen(false)}>
                      <FiLayout size={17} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-[#fff5f5] transition'>
                      <FiLogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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

            {!isLoggedIn ? (
              <div className='flex items-center space-x-2 pt-4 border-t border-[#d9d9d9]'>
                <Link href='/login' className='text-[#374151] font-medium'>
                  Login
                </Link>
                <span className='text-[#999]'>/</span>
                <Link href='signup' className='text-[#374151] font-medium'>
                  Register
                </Link>
              </div>
            ) : (
              <div className='pt-4 border-t border-[#d9d9d9]'>
                <div className='overflow-hidden rounded-[24px] border border-[#f0d7d7] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]'>
                  <div className='bg-gradient-to-r from-[#fff4f4] via-[#fffafa] to-[#fff4f4] px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative shrink-0'>
                        <img
                          src='/avatar.png'
                          alt='Profile Avatar'
                          className='w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-[#ffd9d9]'
                        />
                        <span className='absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white'></span>
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[15px] font-bold text-[#111827]'>
                          My Profile
                        </p>
                        <p className='text-xs font-medium text-[#6B7280]'>
                          Logged in successfully
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 space-y-2'>
                    <Link
                      href='/dashboard'
                      className='w-full flex items-center justify-center gap-2 rounded-2xl bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-[#374151] hover:bg-[#ffeaea] transition'
                      onClick={() => setIsOpen(false)}>
                      <FiLayout size={18} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center justify-center gap-2 rounded-2xl bg-[#fff5f5] px-4 py-3 text-sm font-semibold text-red-600 hover:bg-[#ffeaea] transition'>
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

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
