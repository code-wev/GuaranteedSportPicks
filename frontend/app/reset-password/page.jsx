"use client";

import { useResetPasswordMutation } from "@/feature/AuthApi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const email = useMemo(() => searchParams.get("email") || "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const hasValidResetContext = Boolean(email && token);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!hasValidResetContext) {
      toast.error("Reset link is invalid or incomplete.");
      return;
    }

    try {
      await resetPassword({
        email,
        token,
        password,
        confirmPassword,
      }).unwrap();

      toast.success("Password reset successful. Please sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          "Failed to reset password.",
      );
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4'>
      <Toaster />
      <div className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8'>
        <h1 className='text-2xl font-bold text-[#111827] text-center'>
          Reset Password
        </h1>
        <p className='text-sm text-gray-600 text-center mt-2'>
          Choose a new password for your account.
        </p>

        {!hasValidResetContext && (
          <div className='mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            This reset link is invalid. Please request a new password reset
            email.
          </div>
        )}

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              New Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder='Enter new password'
              className='w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91C1C]'
              minLength={8}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm Password
            </label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder='Confirm new password'
              className='w-full rounded-lg border border-[#D1D5DB] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91C1C]'
              minLength={8}
              required
            />
          </div>

          <button
            type='submit'
            disabled={isLoading || !hasValidResetContext}
            className='w-full rounded-lg bg-[#B91C1C] py-3 text-sm font-medium text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className='mt-5 text-center text-sm text-gray-600'>
          Need another reset link?{" "}
          <Link href='/forgot-password' className='font-medium text-[#B91C1C]'>
            Request again
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
