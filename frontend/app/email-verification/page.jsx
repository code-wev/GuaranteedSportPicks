"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get 'email' and 'token' from the search params
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      const decodedEmail = decodeURIComponent(email); // Decode the email (handling special chars)
      // Validate email format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(decodedEmail)) {
        setError("Invalid email format");
        return;
      }

      // If email and token are valid, proceed with verification
      handleVerification(decodedEmail, token);
    } else {
      setError("Invalid email or token");
    }
  }, [searchParams]); // Depend on searchParams to trigger effect

  const handleVerification = async (email, token) => {
    setLoading(true);
    setError(null); // Reset error message before new request

    try {
      console.log("Sending verification request for:", { email, token });

      // Send PATCH request to the backend for email verification
      const response = await axios.patch(`${base_url}/auth/verify-email`, {
        email,
        token,
      });

      // Log the response from the backend for debugging purposes
      console.log("Verification response:", response);

      if (response?.data?.success) {
        toast.success("Email successfully verified!");
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login after successful verification
        }, 1500);
      } else {
        setError("Verification failed. Please try again.");
        toast.error("Verification failed. Please try again.");
      }
    } catch (err) {
      // Log any errors and show the appropriate message
      console.error("Error during verification:", err);
      const message =
        err?.response?.data?.error || err?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
      <Toaster />
      <div className='w-[90%] max-w-5xl bg-white p-10 shadow-lg rounded-lg overflow-hidden'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Email Verification</h2>
          <p className='mt-4 text-gray-600'>
            We are verifying your email. Please wait a moment.
          </p>

          {loading && <p className='mt-4 text-gray-500'>Loading...</p>}
          {error && <p className='mt-4 text-red-500'>{error}</p>}

          {/* Show success message after verification */}
          {!loading && !error && (
            <p className='mt-4 text-green-500'>Verification successful!</p>
          )}
        </div>
      </div>
    </div>
  );
};

const EmailVerificationPage = () => {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-[#f5f5f5]'>
          <p className='text-gray-500'>Loading...</p>
        </div>
      }>
      <EmailVerification />
    </Suspense>
  );
};

export default EmailVerificationPage;
