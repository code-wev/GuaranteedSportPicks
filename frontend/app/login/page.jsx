"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Put your real backend login endpoint here
  // Examples:
  //  - `${base_url}/auth/login`
  //  - `${base_url}/api/v1/auth/login`
  const LOGIN_URL = `${base_url}/auth/login`;

  const getAxiosErrorMessage = (error) => {
    const serverMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.msg;

    if (serverMsg) return serverMsg;
    if (error?.code === "ERR_NETWORK")
      return "Network error. Check server/CORS.";
    return error?.message || "Something went wrong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // prevent double submit
    if (loading) return;

    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      // IMPORTANT: cookie set হবে only if withCredentials true + backend CORS credentials enabled
      const response = await axios.post(LOGIN_URL, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("LOGIN RESPONSE:", response?.data);

      toast.success("Login Success");

      // cookie stored by browser, now go dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      const message = getAxiosErrorMessage(error);
      toast.error(message);

      // optional UX: if email not verified, redirect to verify/resend page (if you have)
      // if (String(message).toLowerCase().includes("not verified")) {
      //   window.location.href = `/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`;
      // }

      console.log("LOGIN ERROR:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
      <Toaster />
      <div className='w-[90%] max-w-5xl bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden'>
        {/* -------------------- LEFT SIDE -------------------- */}
        <div className='p-8 flex flex-col justify-between'>
          {/* Image Placeholder */}
          <div className='h-64 bg-gray-300 rounded-md w-full'></div>

          {/* Welcome Text */}
          <div className='mt-6'>
            <h2 className='text-2xl font-bold'>
              Welcome to <span className='text-rose-500'>SportPicks</span>
            </h2>

            <p className='mt-3 text-gray-600 text-sm leading-relaxed'>
              Secure access to your account with advanced protection and
              seamless user experience. Join thousands of users who trust our
              platform for their daily needs.
            </p>

            {/* Feature List */}
            <div className='mt-6 grid grid-cols-2 gap-4'>
              {/* Feature 1 */}
              <div className='flex items-start space-x-2'>
                <div className='text-rose-500 text-lg'>🔒</div>
                <div>
                  <p className='font-semibold text-sm'>Secure Authentication</p>
                  <p className='text-xs text-gray-600'>
                    Advanced Security Measures
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className='flex items-start space-x-2'>
                <div className='text-rose-500 text-lg'>📧</div>
                <div>
                  <p className='font-semibold text-sm'>Email Verification</p>
                  <p className='text-xs text-gray-600'>
                    Verified account protection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------- RIGHT SIDE -------------------- */}
        <div className=' p-10 flex flex-col justify-center'>
          <h2 className='text-2xl font-bold text-center'>Welcome Back</h2>
          <p className='text-center text-gray-600 text-sm'>
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            {/* Email */}
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

            {/* Password */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium'>Password</label>
              <input
                type='password'
                className='border border-[#BDBDBD] rounded-lg p-3 text-sm'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember + Forgot */}
            <div className='flex justify-between items-center text-sm'>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' />
                <span>Remember me</span>
              </label>

              {/* IMPORTANT: type="button" না হলে form submit trigger হতে পারে */}
              <button type='button' className='text-rose-500'>
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#B91C1C] text-white py-2 rounded-lg hover:bg-rose-700 text-sm'
              style={{
                opacity: loading ? 0.85 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}>
              {loading ? "Loading..." : "Sign in"}
            </button>

            {/* Sign Up */}
            <p className='text-center text-sm mt-2'>
              Don’t have an account?
              <span
                className='text-[#B91C1C] cursor-pointer'
                onClick={() => (window.location.href = "/register")}>
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
