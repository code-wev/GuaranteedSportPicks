"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

/**
 * Save as: app/(whatever)/page.jsx  (or pages/signup.jsx)
 *
 * Uses the uploaded image at:
 * /mnt/data/83d819e8-10a0-4732-ba5b-1927424bfb7e.png
 *
 * Tailwind CSS is used for styling.
 */

export default function page() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, SetLoading]   = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const validate = () => {
  SetLoading(true); // validation শুরুতেই loading true

  const err = {};

  if (!form.firstName.trim()) err.firstName = "First name is required";
  if (!form.lastName.trim()) err.lastName = "Last name is required";
  
  if (!form.email.trim()) err.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    err.email = "Invalid email";

  if (!form.password) err.password = "Password is required";
  else if (form.password.length < 6)
    err.password = "Password should be at least 6 characters";

  if (form.password !== form.confirmPassword)
    err.confirmPassword = "Passwords do not match";

  if (!form.agree) err.agree = "You must agree to the terms";

  setErrors(err);

  // যদি error থাকে
  if (Object.keys(err).length > 0) {
    SetLoading(false); // error থাকলে loading বন্ধ
    return false;
  }

  return true; // সব ঠিক আছে → loading true থাকবে
};


  const handleSubmit = async(e) => {

    SetLoading(true)
    e.preventDefault();
    if (!validate()) return;

    // Build payload to log
const payload = {
  firstName: form.firstName.trim(),
  lastName: form.lastName.trim(),
  email: form.email.trim(),
  password: form.password.trim(),   // ✅ send actual password
  createdAt: new Date().toISOString(),
  agreedToTerms: form.agree,
};


    try {

      const response = await axios.post(`${base_url}/user/register`, payload);
      console.log(response);
      toast.success("User Registration Successfully");
  window.location.href = '/login';

      
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }finally{
      SetLoading(false)
    }



    // show user a small confirmation (you can replace with toast)

  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Toaster/>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: image + info */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-full h-56 md:h-72 bg-gray-200 rounded-xl overflow-hidden mb-6">
              {/* Use uploaded image path as src */}
              <img
                src="/mnt/data/83d819e8-10a0-4732-ba5b-1927424bfb7e.png"
                alt="hero"
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Welcome to{" "}
              <span className="inline-block bg-clip-text text-transparent  from-pink-400 to-rose-300">
                <span className="px-1 rounded-md" style={{ color: "#ff7aa8" }}>
                  SportPicks
                </span>
              </span>
            </h2>

            <p className="text-sm text-gray-500 max-w-2xl">
              Secure access to your account with advanced protection and
              seamless user experience. Join thousands of users who trust our
              platform for their daily needs.
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-rose-50 text-rose-600">
                {/* shield svg */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 1L3 5v6c0 5.25 3.99 10.74 9 12 5.01-1.26 9-6.75 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Secure Authentication
                </div>
                <div className="text-xs text-gray-500">
                  Advanced Security Measures
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-pink-50 text-pink-600">
                {/* mail/check svg */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 6l10 6 10-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Email Verification
                </div>
                <div className="text-xs text-gray-500">
                  Verified account protection
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sign up card */}
        <div className="lg:col-span-5 flex items-center">
          <div className="w-full bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 text-center">
              Create Account
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Join us today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.firstName ? "border-rose-500" : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  {errors.firstName && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.lastName ? "border-rose-500" : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  {errors.lastName && (
                    <p className="text-rose-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.email ? "border-rose-500" : "border-gray-200"
                  } bg-gray-50 text-sm focus:outline-none`}
                />
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  type="password"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.password ? "border-rose-500" : "border-gray-200"
                  } bg-gray-50 text-sm focus:outline-none`}
                />
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  type="password"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.confirmPassword ? "border-rose-500" : "border-gray-200"
                  } bg-gray-50 text-sm focus:outline-none`}
                />
                {errors.confirmPassword && (
                  <p className="text-rose-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  name="agree"
                  type="checkbox"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1"
                />
                <label className="text-xs text-gray-600">
                  I agree to the{" "}
                  <span className="text-rose-600 font-medium">
                    Terms of service
                  </span>{" "}
                  and{" "}
                  <span className="text-rose-600 font-medium">
                    Privacy Policy
                  </span>
                </label>
              </div>
              {errors.agree && (
                <p className="text-rose-500 text-xs mt-1">{errors.agree}</p>
              )}

              <button
                type="submit"
                className="w-full mt-1 py-3 rounded-lg font-semibold text-white"
                style={{ backgroundColor: "#B91C1C" }} /* user's primary color */
              >
              {

                isLoading ? "Loading..." : "Create Account"
              }
              </button>

              <p className="text-center text-sm text-gray-500 mt-3">
                Already have an account?{" "}
                <Link href={'/login'} className="text-rose-600 font-medium cursor-pointer">Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
