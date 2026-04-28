/* eslint-disable @next/next/no-img-element */
"use client";

import { useMyProfileQuery } from "@/feature/UserApi";
import logo from "@/public/gsp logo metalic.png";
import Cookies from "js-cookie";
import Image from "next/image";
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
  const { data } = useMyProfileQuery(undefined, { skip: !isLoggedIn });
  const user = data?.data;

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

  // Hide Navbar in dashboard routes
  if (pathName.includes("/dashboard")) {
    return null;
  }

  const isActive = (path) => pathName === path;

  return (
    <nav className='w-full bg-black border-b py-2 border-gray-800'>
      <div className='max-w-7xl mx-auto px-6 flex items-center justify-between h-20'>
        {/* Logo */}
        <Link href='/'>
          <Image src={logo} height={140} width={140} alt='Logo' />
        </Link>

        {/* Desktop Links */}
        <ul className='hidden lg:flex items-center space-x-6 text-[16px] font-semibold'>
          <li>
            <Link
              href='/'
              className={`transition duration-200 ${
                isActive("/")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              Home
            </Link>
          </li>

          <li>
            <Link
              href='/about'
              className={`transition duration-200 ${
                isActive("/about")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              How It Works
            </Link>
          </li>

          <li>
            <Link
              href='/freepicks'
              className={`transition duration-200 ${
                isActive("/freepicks")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              Free Picks
            </Link>
          </li>

          <li>
            <Link
              href='/packages'
              className={`transition duration-200 ${
                isActive("/packages")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              Premium Packages
            </Link>
          </li>

          <li>
            <Link
              href='/blog'
              className={`transition duration-200 ${
                isActive("/blog")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              Betting News
            </Link>
          </li>

          <li>
            <Link
              href='/contact'
              className={`transition duration-200 ${
                isActive("/contact")
                  ? "text-red-500 font-semibold"
                  : "text-gray-300 hover:text-red-400"
              }`}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className='hidden lg:flex items-center space-x-4 text-[14px]'>
          {!isLoggedIn ? (
            <>
              <Link
                href='/login'
                className='text-gray-300 font-medium hover:text-red-400 transition duration-200'>
                Login
              </Link>
              <span className='text-gray-600'>/</span>
              <Link
                href='signup'
                className='text-gray-300 font-medium hover:text-red-400 transition duration-200'>
                Register
              </Link>
            </>
          ) : (
            <div className='relative' ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className='group flex items-center gap-3 rounded-full border border-gray-700 bg-gray-900 pl-1.5 pr-3 py-1.5 shadow-lg hover:bg-gray-800 transition-all duration-200'>
                <div className='relative shrink-0'>
                  <img
                    src='/avatar.png'
                    alt='Profile Avatar'
                    className='w-11 h-11 rounded-full object-cover border-2 border-gray-700 ring-2 ring-gray-600'
                  />
                  <span className='absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900'></span>
                </div>

                <div className='flex flex-col items-start leading-tight'>
                  <span className='text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400'>
                    Account
                  </span>
                  <span className='text-sm font-semibold text-gray-200'>
                    My Profile
                  </span>
                </div>

                <FiChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className='absolute right-0 mt-3 w-60 overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl z-50'>
                  <div className='bg-gradient-to-br from-gray-800 to-gray-900 px-4 py-4 border-b border-gray-700'>
                    <div className='flex items-center gap-3'>
                      <img
                        src='/avatar.png'
                        alt='Profile Avatar'
                        className='w-14 h-14 rounded-full object-cover border-2 border-gray-700 ring-2 ring-gray-600'
                      />
                      <div>
                        <p className='text-sm font-bold text-gray-100'>
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : "Welcome Back"}
                        </p>
                        <p className='text-xs text-gray-400'>
                          {user?.email || "Access your account"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='p-2'>
                    <Link
                      href='/dashboard'
                      className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-800 transition'
                      onClick={() => setProfileOpen(false)}>
                      <FiLayout size={17} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-400 hover:bg-gray-800 transition'>
                      <FiLogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            href='/freepicks'
            className='ml-4 bg-red-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded lg:rounded-full text-xs font-semibold hover:bg-red-700 transition shadow-lg'>
            Get Picks Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='lg:hidden flex items-center text-gray-300 hover:text-red-400 transition'
          onClick={() => setIsOpen(!isOpen)}
          aria-label='Toggle Menu'>
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className='lg:hidden bg-gray-900 border-t border-gray-800'>
          <ul className='flex flex-col space-y-4 py-4 px-6 text-[16px] font-[600]'>
            <li>
              <Link
                href='/'
                className={`transition duration-200 ${
                  isActive("/")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            <li>
              <Link
                href='/about'
                className={`transition duration-200 ${
                  isActive("/about")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                About
              </Link>
            </li>

            <li>
              <Link
                href='/freepicks'
                className={`transition duration-200 ${
                  isActive("/freepicks")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                Free Picks
              </Link>
            </li>

            <li>
              <Link
                href='/packages'
                className={`transition duration-200 ${
                  isActive("/packages")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                Packages
              </Link>
            </li>

            <li>
              <Link
                href='/blog'
                className={`transition duration-200 ${
                  isActive("/blog")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                Betting News
              </Link>
            </li>

            <li>
              <Link
                href='/contact'
                className={`transition duration-200 ${
                  isActive("/contact")
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                onClick={() => setIsOpen(false)}>
                Contact
              </Link>
            </li>

            {!isLoggedIn ? (
              <div className='flex items-center space-x-2 pt-4 border-t border-gray-800'>
                <Link
                  href='/login'
                  className='text-gray-300 font-medium hover:text-red-400 transition'>
                  Login
                </Link>
                <span className='text-gray-600'>/</span>
                <Link
                  href='signup'
                  className='text-gray-300 font-medium hover:text-red-400 transition'>
                  Register
                </Link>
              </div>
            ) : (
              <div className='pt-4 border-t border-gray-800'>
                <div className='overflow-hidden rounded-[24px] border border-gray-700 bg-gray-900 shadow-xl'>
                  <div className='bg-gradient-to-r from-gray-800 via-gray-800 to-gray-800 px-4 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='relative shrink-0'>
                        <img
                          src='/avatar.png'
                          alt='Profile Avatar'
                          className='w-14 h-14 rounded-full object-cover border-2 border-gray-700 ring-2 ring-gray-600'
                        />
                        <span className='absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-gray-900'></span>
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[15px] font-bold text-gray-100'>
                          My Profile
                        </p>
                        <p className='text-xs font-medium text-gray-400'>
                          Logged in successfully
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='p-3 space-y-2'>
                    <Link
                      href='/dashboard'
                      className='w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-200 hover:bg-gray-700 transition'
                      onClick={() => setIsOpen(false)}>
                      <FiLayout size={18} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className='w-full flex items-center justify-center gap-2 rounded-2xl bg-gray-800 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-gray-700 transition'>
                      <FiLogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Link
              href='#'
              className='bg-red-600 text-white w-full text-center px-4 py-2 lg:px-5 lg:py-3 rounded-xl lg:rounded-full text-xs font-semibold hover:bg-red-700 transition'
              onClick={() => setIsOpen(false)}>
              Get Picks Now
            </Link>
          </ul>
        </div>
      )}
    </nav>
  );
}
