"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const FORGOT_URL = `${base_url}/auth/forget-password`;

  const getAxiosErrorMessage = (error) => {
    const serverMsg =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.response?.data?.msg;

    if (serverMsg) return serverMsg;
    if (error?.code === "ERR_NETWORK")
      return "Network error. Check server/CORS.";
    return error?.message || "Something went wrong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const payload = { email: email.trim().toLowerCase() };

      const res = await axios.post(FORGOT_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("FORGOT PASSWORD RESPONSE:", res?.data);

      toast.success("Password reset link sent! Check your email.");
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      toast.error(msg);
      console.log("FORGOT PASSWORD ERROR:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
      <Toaster />
      <div className='w-[90%] max-w-5xl bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden'>
        {/* LEFT SIDE */}
        <div className='p-8 flex flex-col justify-between'>
          <div className='h-64 bg-gray-300 rounded-md w-full'></div>

          <div className='mt-6'>
            <h2 className='text-2xl font-bold'>
              Welcome to <span className='text-rose-500'>SportPicks</span>
            </h2>

            <p className='mt-3 text-gray-600 text-sm leading-relaxed'>
              Enter your email to receive a password reset link.
            </p>

            <div className='mt-6 grid grid-cols-2 gap-4'>
              <div className='flex items-start space-x-2'>
                <div className='text-rose-500 text-lg'>🔒</div>
                <div>
                  <p className='font-semibold text-sm'>Secure Process</p>
                  <p className='text-xs text-gray-600'>Reset link via email</p>
                </div>
              </div>

              <div className='flex items-start space-x-2'>
                <div className='text-rose-500 text-lg'>📧</div>
                <div>
                  <p className='font-semibold text-sm'>Email Delivery</p>
                  <p className='text-xs text-gray-600'>Fast & reliable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='p-10 flex flex-col justify-center'>
          <h2 className='text-2xl font-bold text-center'>Forgot Password</h2>
          <p className='text-center text-gray-600 text-sm'>
            We’ll send you a reset link
          </p>

          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <div className='flex flex-col'>
              <label className='text-sm font-medium'>Email Address</label>
              <input
                type='email'
                className='border border-[#BDBDBD] rounded-lg p-3 text-sm'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#B91C1C] text-white py-2 rounded-lg hover:bg-rose-700 text-sm'
              style={{
                opacity: loading ? 0.85 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? "Loading..." : "Send Reset Link"}
            </button>

            <p className='text-center text-sm mt-2'>
              Back to
              <span
                className='text-[#B91C1C] ml-1.5 cursor-pointer'
                onClick={() => (window.location.href = "/login")}>
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
