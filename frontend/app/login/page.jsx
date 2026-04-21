"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const LOGIN_URL = `${base_url}/auth/login`;

  const extractErrorMessage = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value.trim();

    if (Array.isArray(value)) {
      return value
        .map((item) => extractErrorMessage(item))
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      if (typeof value.message === "string") return value.message.trim();
      if (typeof value.msg === "string") return value.msg.trim();
      if (typeof value.error === "string") return value.error.trim();

      if (Array.isArray(value.message)) {
        const message = value.message
          .map((item) => extractErrorMessage(item))
          .filter(Boolean)
          .join(", ");
        if (message) return message;
      }

      if (Array.isArray(value.errors)) {
        const errors = value.errors
          .map((item) => extractErrorMessage(item))
          .filter(Boolean)
          .join(", ");
        if (errors) return errors;
      }

      const nestedMessages = Object.values(value)
        .map((item) => extractErrorMessage(item))
        .filter(Boolean)
        .join(", ");

      if (nestedMessages) return nestedMessages;
    }

    return "";
  };

  const getAxiosErrorMessage = (error) => {
    const responseData = error?.response?.data;

    const serverMsg =
      extractErrorMessage(responseData?.error) ||
      extractErrorMessage(responseData?.message) ||
      extractErrorMessage(responseData?.msg) ||
      extractErrorMessage(responseData?.errors) ||
      extractErrorMessage(responseData);

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
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      const response = await axios.post(LOGIN_URL, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      console.log("LOGIN RESPONSE:", response?.data);

      // backend response structure অনুযায়ী token বের করো
      const token =
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.data?.token;

      if (!token) {
        toast.error("Token not found in response");
        return;
      }

      // token cookie তে save
      Cookies.set("token", token, {
        expires: 7, // 7 days
        secure: true, // https হলে better
        sameSite: "Strict",
      });

      // user info save
      if (response?.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      toast.success("Login Success");

      // redirect
      window.location.href = "/dashboard";
    } catch (error) {
      const message = getAxiosErrorMessage(error);

      console.log("LOGIN ERROR:", error?.response?.data || error);

      if (String(message).toLowerCase().includes("email not verified")) {
        toast.error("Email not verified. Please verify your email.");
        setTimeout(() => {
          window.location.href = `/resend-verification?email=${encodeURIComponent(
            email.trim().toLowerCase(),
          )}`;
        }, 1500);
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
      {/* <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
        }}
      /> */}
      <div className='w-[90%] max-w-5xl bg-white grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-lg overflow-hidden'>
        {/* LEFT SIDE */}
        <div className='p-8 flex flex-col justify-between'>
          <div className='h-64 bg-gray-300 rounded-md w-full'></div>

          <div className='mt-6'>
            <h2 className='text-2xl font-bold'>
              Welcome to <span className='text-rose-500'>SportPicks</span>
            </h2>

            <p className='mt-3 text-gray-600 text-sm leading-relaxed'>
              Secure access to your account with advanced protection and
              seamless user experience. Join thousands of users who trust our
              platform for their daily needs.
            </p>

            <div className='mt-6 grid grid-cols-2 gap-4'>
              <div className='flex items-start space-x-2'>
                <div className='text-rose-500 text-lg'>🔒</div>
                <div>
                  <p className='font-semibold text-sm'>Secure Authentication</p>
                  <p className='text-xs text-gray-600'>
                    Advanced Security Measures
                  </p>
                </div>
              </div>

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

        {/* RIGHT SIDE */}
        <div className='p-10 flex flex-col justify-center'>
          <h2 className='text-2xl font-bold text-center'>Welcome Back</h2>
          <p className='text-center text-gray-600 text-sm'>
            Sign in to your account
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

            <div className='flex flex-col'>
              <label className='text-sm font-medium'>Password</label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  className='border border-[#BDBDBD] rounded-lg p-3 pr-10 text-sm w-full'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className='flex justify-between items-center text-sm'>
              <label className='flex items-center space-x-2'>
                <input type='checkbox' />
                <span>Remember me</span>
              </label>

              <button
                type='button'
                className='text-rose-500'
                onClick={() => (window.location.href = "/forgot-password")}>
                Forgot Password?
              </button>
            </div>

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

            <p className='text-center text-sm mt-2'>
              Don’t have an account?
              <span
                className='text-[#B91C1C] cursor-pointer'
                onClick={() => (window.location.href = "/signup")}>
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
