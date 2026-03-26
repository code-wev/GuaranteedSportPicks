"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const pathName = usePathname();

  if (pathName.includes("/dashboard")) {
    return null;
  }
  return (
    <footer
      className="relative w-full text-white overflow-hidden"
      style={{
        backgroundImage: "url('/home/footerbg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-14 pb-8">
        {/* ===== Top Grid ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-10 border-b border-[#ffffff1a]">
          {/* 1️⃣ Brand & About */}
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-[#E63946] rounded-sm"></div>
              <h2 className="text-[18px] font-bold text-white">
                Sport<span className="text-[#D7D7D7] font-medium">Picks</span>
              </h2>
            </div>

            {/* About Text */}
            <p className="text-[#d8d8d8] text-[13px] leading-relaxed mb-6 max-w-[280px]">
              Your trusted partner for expert sports picks with verified records
              and guaranteed results. Win smarter, not harder, with our
              professional analysis and proven strategies.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: <FaFacebookF />, href: "#" },
                { icon: <FaLinkedinIn />, href: "#" },
                { icon: <FaInstagram />, href: "#" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-[#ffffff25] bg-[#ffffff10] hover:bg-[#E63946] transition-all duration-300"
                >
                  <span className="text-white text-[13px]">{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 2️⃣ Track Record */}
          <div>
            <h3 className="text-[15px] font-semibold mb-4 text-white">
              Our Track Record
            </h3>
            <ul className="space-y-2 text-[13px] text-[#D0D0D0]">
              <li>Win Rate</li>
              <li>Happy Customers</li>
              <li>Total Winnings</li>
              <li>Years Experience</li>
            </ul>
          </div>

          {/* 3️⃣ For Employers */}
          <div>
            <h3 className="text-[15px] font-semibold mb-4 text-white">
              For Employers
            </h3>
            <ul className="space-y-2 text-[13px] text-[#D0D0D0]">
              <li>Post Jobs</li>
              <li>Find Talent</li>
              <li>Recruiting Solutions</li>
            </ul>
          </div>

          {/* 4️⃣ Company */}
          <div>
            <h3 className="text-[15px] font-semibold mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-2 text-[13px] text-[#D0D0D0]">
              <li>
                <Link href="#">About Us</Link>
              </li>
              <li>
                <Link href="#">Contact</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== Middle Links ===== */}
        <div className=" flex flex-wrap justify-center gap-x-6 gap-y-3 text-[12.5px] text-[#c9c9c9] mt-6 mb-6">
          {[
            "Home",
            "Free Picks",
            "Packages",
            "Blog",
            "About",
            "Privacy Policy",
            "Terms of Service",
          ].map((item, i) => (
            <Link
              key={i}
              href="#"
              className="hover:text-white transition-colors duration-150"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between  border-t border-[#ffffff1a] pt-6">
          {/* ===== Disclaimer ===== */}
          <p className="text-[#bfbfbf] text-[12px] leading-relaxed w-1/2">
            Disclaimer: Sports betting involves risks. Must be 18+ to
            participate. Please gamble responsibly. If you have a gambling
            problem, call 1-800-GAMBLER or visit ncpgambling.org
          </p>

          {/* ===== Bottom Row ===== */}
          <div className="flex flex-col md:flex-row justify-between items-center text-[12.5px] text-[#bfbfbf] border-t border-[#ffffff10]">
            <span>© 2025 SportPicks.com. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
