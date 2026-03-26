"use client";

import { useResetPasswordMutation } from "@/feature/AuthApi";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("form"); // form | loading | success | error
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

    if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
    }

    setStatus("loading");

    try {
      await resetPassword({
        email,
        token,
        password,
        confirmPassword,
      }).unwrap();

      setStatus("success");
      toast.success("Password reset successful!");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setStatus("form");
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
      <div className='w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100'>
        <div className="text-center mb-8">
            <h1 className='text-3xl font-bold text-[#111827]'>
            Reset Password
            </h1>
            <p className='text-sm text-gray-500 mt-2'>
            Please enter your new password below.
            </p>
        </div>

        {status === "loading" && (
          <div className="py-10 text-center">
            <div className="w-12 h-12 border-4 border-[#B91C1C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Updating your password...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-10 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Success!</h2>
            <p className="text-gray-600 mt-2">Your password has been reset. Redirecting to login...</p>
          </div>
        )}

        {status === "form" && (
          <>
            {!hasValidResetContext && (
              <div className='mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-3'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p>This reset link is invalid or expired. Please request a new one.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div>
                <label className='block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder='••••••••'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition-all'
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className='block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder='••••••••'
                  className='w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition-all'
                  minLength={8}
                  required
                />
              </div>

              <button
                type='submit'
                disabled={isLoading || !hasValidResetContext}
                className='w-full rounded-xl bg-[#B91C1C] py-4 text-sm font-bold text-white shadow-lg shadow-red-100 transition-all hover:bg-[#991B1B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isLoading ? "Processing..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                <Link href='/forgot-password' className='text-sm font-bold text-[#B91C1C] hover:underline'>
                    Request a new link
                </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
           <div className="w-10 h-10 border-4 border-gray-200 border-t-[#B91C1C] rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
