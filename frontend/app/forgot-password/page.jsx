"use client";

import { useForgetPasswordMutation } from "@/feature/AuthApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await forgetPassword({
        email: email.trim().toLowerCase(),
      }).unwrap();

      toast.success("Password reset link sent to your email.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to send password reset email.",
      );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4'>
      <Toaster />
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8'>
        <h1 className='text-2xl font-bold text-[#111827] text-center'>
          Forgot Password
        </h1>
        <p className='text-sm text-gray-600 text-center mt-2'>
          Enter your account email and we&apos;ll send you a secure reset link.
        </p>

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder='Enter your email'
              className='w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91C1C]'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading}
            className='w-full rounded-lg bg-[#B91C1C] py-3 text-sm font-medium text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-gray-600'>
          Remember your password?{" "}
          <Link href='/login' className='font-medium text-[#B91C1C]'>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
