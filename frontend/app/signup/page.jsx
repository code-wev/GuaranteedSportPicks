"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Tailwind CSS is used for styling.
 * NOTE: Design/markup unchanged — only functionality hardened.
 */

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, SetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Put your real backend register endpoint here
  // Examples:
  //  - `${base_url}/auth/register`
  //  - `${base_url}/api/v1/auth/register`
  const REGISTER_URL = `${base_url}/auth/register`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const referralCode =
      params.get("promo") || params.get("ref") || params.get("affiliate") || "";

    if (referralCode) {
      setForm((prev) => ({
        ...prev,
        referralCode: referralCode.toUpperCase(),
      }));
    }
  }, []);

  const validate = () => {
    const err = {};

    if (!form.firstName.trim()) err.firstName = "First name is required";
    if (!form.lastName.trim()) err.lastName = "Last name is required";

    if (!form.email.trim()) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      err.email = "Invalid email";

    // phoneNumber is optional — no validation required

    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Password should be at least 6 characters";

    if (!form.confirmPassword)
      err.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    if (!form.agree) err.agree = "You must agree to the terms";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getBackendFieldErrors = (data) => {
    const fieldErrors = {};

    if (!Array.isArray(data?.errors)) return fieldErrors;

    data.errors.forEach((item) => {
      const field = item?.field;
      const message = item?.message;

      if (!field || !message) return;

      if (fieldErrors[field]) {
        fieldErrors[field] = `${fieldErrors[field]}, ${message}`;
      } else {
        fieldErrors[field] = message;
      }
    });

    return fieldErrors;
  };

  const getAxiosErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
      const detailedMessages = responseData.errors
        .map((item) => item?.message)
        .filter(Boolean)
        .join(", ");

      if (detailedMessages) return detailedMessages;
    }

    const serverMsg =
      responseData?.error || responseData?.message || responseData?.msg;

    if (serverMsg) return serverMsg;

    if (error?.code === "ERR_NETWORK")
      return "Network error. Check server/CORS.";
    return error?.message || "Something went wrong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prevent double submit
    if (isLoading) return;

    // validate first
    if (!validate()) return;

    SetLoading(true);

    // backend payload (CreateUserInput)
    // phoneNumber and referralCode are fully omitted from the object
    // if empty — so the key never reaches the backend at all
    const trimmedPhone = form.phoneNumber.trim();
    const trimmedReferral = form.referralCode.trim().toUpperCase();

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      ...(trimmedPhone && { phoneNumber: trimmedPhone }),
      ...(trimmedReferral && { referralCode: trimmedReferral }),
    };

    try {
      const response = await axios.post(REGISTER_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("REGISTER RESPONSE:", response?.data);

      toast.success(
        "Registration successful! Please verify your email, then login.",
      );

      // optional: small delay so user sees toast
      setTimeout(() => {
        window.location.href = "/login";
      }, 600);
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      const backendFieldErrors = getBackendFieldErrors(error?.response?.data);

      if (Object.keys(backendFieldErrors).length > 0) {
        setErrors((prev) => ({
          ...prev,
          ...backendFieldErrors,
        }));
      }

      toast.error(message);
      console.log("REGISTER ERROR:", error?.response?.data || error);
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-6'>
      <Toaster />
      <div className='max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8'>
        {/* LEFT: image + info */}
        <div className='lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-between'>
          <div>
            <div className='relative w-full h-56 md:h-72 bg-gray-200 rounded-xl overflow-hidden mb-6'>
              <Image
                src='/home/homeBannerBg.png'
                alt='hero'
                fill
                className='object-cover'
              />
            </div>

            <h2 className='text-2xl md:text-3xl font-extrabold text-gray-900 mb-2'>
              Welcome to{" "}
              <span className='inline-block bg-clip-text text-transparent  from-pink-400 to-rose-300'>
                <span className='px-1 rounded-md' style={{ color: "#ff7aa8" }}>
                  SportPicks
                </span>
              </span>
            </h2>

            <p className='text-sm text-gray-500 max-w-2xl'>
              Secure access to your account with advanced protection and
              seamless user experience. Join thousands of users who trust our
              platform for their daily needs.
            </p>
          </div>

          {/* Features */}
          <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='flex items-start gap-3'>
              <div className='flex items-center justify-center w-10 h-10 rounded-md bg-rose-50 text-rose-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
                  viewBox='0 0 24 24'
                  fill='currentColor'>
                  <path d='M12 1L3 5v6c0 5.25 3.99 10.74 9 12 5.01-1.26 9-6.75 9-12V5l-9-4z' />
                </svg>
              </div>
              <div>
                <div className='text-sm font-semibold text-gray-800'>
                  Secure Authentication
                </div>
                <div className='text-xs text-gray-500'>
                  Advanced Security Measures
                </div>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <div className='flex items-center justify-center w-10 h-10 rounded-md bg-pink-50 text-pink-600'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-5 h-5'
                  viewBox='0 0 24 24'
                  fill='currentColor'>
                  <path d='M2 6l10 6 10-6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z' />
                </svg>
              </div>
              <div>
                <div className='text-sm font-semibold text-gray-800'>
                  Email Verification
                </div>
                <div className='text-xs text-gray-500'>
                  Verified account protection
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sign up card */}
        <div className='lg:col-span-5 flex items-center'>
          <div className='w-full bg-white rounded-2xl p-6 md:p-8 shadow-lg'>
            <h3 className='text-2xl font-bold text-gray-900 text-center'>
              Create Account
            </h3>
            <p className='text-sm text-gray-500 text-center mb-6'>
              Join us today
            </p>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs text-gray-600 mb-1'>
                    First Name
                  </label>
                  <input
                    name='firstName'
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder='First name'
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.firstName ? "border-rose-500" : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  {errors.firstName && (
                    <p className='text-rose-500 text-xs mt-1'>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-xs text-gray-600 mb-1'>
                    Last Name
                  </label>
                  <input
                    name='lastName'
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder='Last name'
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors.lastName ? "border-rose-500" : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  {errors.lastName && (
                    <p className='text-rose-500 text-xs mt-1'>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-xs text-gray-600 mb-1'>
                  Email Address
                </label>
                <input
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                  className={`w-full px-3 py-2 rounded-lg border ${
                    errors.email ? "border-rose-500" : "border-gray-200"
                  } bg-gray-50 text-sm focus:outline-none`}
                />
                {errors.email && (
                  <p className='text-rose-500 text-xs mt-1'>{errors.email}</p>
                )}
              </div>

              <div>
                <label className='block text-xs text-gray-600 mb-1'>
                  Phone Number
                </label>
                <input
                  name='phoneNumber'
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder='Enter your phone number (optional)'
                  className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-xs text-gray-600 mb-1'>
                  Promo Code
                </label>
                <input
                  name='referralCode'
                  value={form.referralCode}
                  onChange={handleChange}
                  placeholder='Optional promo code'
                  className='w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none uppercase'
                />
              </div>

              <div>
                <label className='block text-xs text-gray-600 mb-1'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    placeholder='Create a password'
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                      errors.password ? "border-rose-500" : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className='text-rose-500 text-xs mt-1'>
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-xs text-gray-600 mb-1'>
                  Confirm Password
                </label>
                <div className='relative'>
                  <input
                    name='confirmPassword'
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder='Confirm your password'
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-3 py-2 pr-10 rounded-lg border ${
                      errors.confirmPassword
                        ? "border-rose-500"
                        : "border-gray-200"
                    } bg-gray-50 text-sm focus:outline-none`}
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }>
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className='text-rose-500 text-xs mt-1'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className='flex items-start gap-2'>
                <input
                  name='agree'
                  type='checkbox'
                  checked={form.agree}
                  onChange={handleChange}
                  className='mt-1'
                />
                <label className='text-xs text-gray-600'>
                  I agree to the{" "}
                  <span className='text-rose-600 font-medium'>
                    Terms of service
                  </span>{" "}
                  and{" "}
                  <span className='text-rose-600 font-medium'>
                    Privacy Policy
                  </span>
                </label>
              </div>
              {errors.agree && (
                <p className='text-rose-500 text-xs mt-1'>{errors.agree}</p>
              )}

              <button
                type='submit'
                disabled={isLoading}
                className='w-full mt-1 py-3 rounded-lg font-semibold text-white'
                style={{
                  backgroundColor: "#B91C1C",
                  opacity: isLoading ? 0.85 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}>
                {isLoading ? "Loading..." : "Create Account"}
              </button>

              <p className='text-center text-sm text-gray-500 mt-3'>
                Already have an account?{" "}
                <Link
                  href={"/login"}
                  className='text-rose-600 font-medium cursor-pointer'>
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
