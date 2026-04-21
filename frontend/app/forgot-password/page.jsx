"use client";

import { useForgetPasswordMutation } from "@/feature/AuthApi";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form"); // form | loading | success
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");

    try {
      await forgetPassword({
        email: email.trim().toLowerCase(),
      }).unwrap();

      setStatus("success");
      toast.success("Reset link sent successfully!");
    } catch (error) {
      setStatus("form");
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to send password reset email.",
      );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4'>
      {/* <Toaster /> */}
      <div className='w-full max-w-md bg-white shadow-xl rounded-3xl p-10 border border-gray-100'>
        <div className='text-center mb-8'>
          <div className='w-16 h-16 bg-red-50 text-[#B91C1C] rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-extrabold text-[#111827]'>
            Forgot Password?
          </h1>
          <p className='text-sm text-gray-500 mt-2 font-medium'>
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {status === "loading" && (
          <div className='py-10 text-center'>
            <div className='w-12 h-12 border-4 border-[#B91C1C] border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <p className='text-gray-600 font-bold'>Sending reset link...</p>
          </div>
        )}

        {status === "success" && (
          <div className='py-10 text-center animate-in fade-in zoom-in duration-300'>
            <div className='w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={3}
                  d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-800'>
              Check your email
            </h2>
            <p className='text-gray-500 mt-3 font-medium px-4'>
              We've sent a password reset link to{" "}
              <span className='text-gray-900 font-bold'>{email}</span>
            </p>
            <div className='mt-8'>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 text-sm font-bold text-[#B91C1C] hover:text-[#991B1B] transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {status === "form" && (
          <>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label className='block text-xs font-black text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1'>
                  Email Address
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206'
                      />
                    </svg>
                  </div>
                  <input
                    type='email'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder='name@example.com'
                    className='w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B91C1C] focus:bg-white transition-all'
                    required
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full rounded-2xl bg-[#B91C1C] py-4 text-sm font-black text-white shadow-xl shadow-red-100 transition-all hover:bg-[#991B1B] hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60'>
                {isLoading ? "Sending..." : "Reset Password"}
              </button>
            </form>

            <div className='mt-8 pt-8 border-t border-gray-100 text-center'>
              <Link
                href='/login'
                className='inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#B91C1C] transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 19l-7-7m0 0l7-7m-7 7h18'
                  />
                </svg>
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
