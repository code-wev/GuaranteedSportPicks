"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ResendVerification = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const router = useRouter(); // Router for redirecting after success
  const searchParams = useSearchParams(); // Using useSearchParams to get query parameters

  useEffect(() => {
    const emailParam = searchParams.get("email"); // Get 'email' from search params

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam)); // Decode and set email state
    }
  }, [searchParams]); // This runs when searchParams change

  // Function to handle the resend verification request
  const handleResend = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error message

    try {
      const response = await axios.post(
        `${base_url}/auth/resend-verification-email`,
        {
          email: email.trim().toLowerCase(), // Send the email to the backend
        },
      );

      if (response.status === 200) {
        toast.success("Verification email sent! Please check your inbox.");
        // Optional: Redirect to login page or show a success message
        setTimeout(() => {
          router.push("/login"); // Redirect to login after success
        }, 1500);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
      toast.error(
        err?.response?.data?.error || "Failed to send verification email",
      );
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
      <Toaster /> {/* Toast notifications */}
      <div className='w-[90%] max-w-md bg-white p-8 shadow-lg rounded-lg overflow-hidden'>
        <h2 className='text-2xl font-bold text-center'>
          Resend Verification Email
        </h2>
        <p className='text-center text-sm text-gray-600 mt-2'>
          Enter your email address to receive a verification link again.
        </p>
        {error && <p className='text-red-500 text-center mt-4'>{error}</p>}{" "}
        {/* Display error message */}
        {/* Email input field */}
        <div className='mt-6'>
          <label className='text-sm font-medium'>Email Address</label>
          <input
            type='email'
            className='w-full px-3 py-2 border border-[#BDBDBD] rounded-lg text-sm mt-2'
            placeholder='Enter your email'
            value={email} // Automatically filled with email from URL params
            onChange={(e) => setEmail(e.target.value)} // Update email on change
            required
          />
        </div>
        {/* Resend button */}
        <button
          onClick={handleResend}
          className='w-full bg-[#B91C1C] text-white py-2 rounded-lg mt-6'
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Sending..." : "Resend Verification Email"}
          {/* Button text */}
        </button>
      </div>
    </div>
  );
};

export default ResendVerification;
