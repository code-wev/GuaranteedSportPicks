/* eslint-disable react-hooks/immutability */
"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setStatus("error");
      setError("Invalid email or token");
      return;
    }

    const decodedEmail = decodeURIComponent(email);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(decodedEmail)) {
      setStatus("error");
      setError("Invalid email format");
      return;
    }

    const requestKey = `email-verification-${decodedEmail}-${token}`;

    // Strict mode / duplicate effect call prevent
    if (sessionStorage.getItem(requestKey) === "done") {
      setStatus("success");
      return;
    }

    if (sessionStorage.getItem(requestKey) === "processing") {
      return;
    }

    sessionStorage.setItem(requestKey, "processing");
    handleVerification(decodedEmail, token, requestKey);
  }, [searchParams]);

  const handleVerification = async (email, token, requestKey) => {
    setStatus("loading");
    setError(null);

    try {
      console.log("Sending verification request for:", { email, token });

      const response = await axios.patch(`${base_url}/auth/verify-email`, {
        email,
        token,
      });

      console.log("Verification response:", response);

      const isSuccess =
        response?.status >= 200 &&
        response?.status < 300 &&
        response?.data?.success !== false;

      if (isSuccess) {
        sessionStorage.setItem(requestKey, "done");
        setStatus("success");
        toast.success("Email successfully verified!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        sessionStorage.removeItem(requestKey);
        setStatus("error");
        setError("Verification failed. Please try again.");
        toast.error("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during verification:", err);

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      const lowerMessage = String(message).toLowerCase();

      // if backend says already verified, treat as success
      if (
        lowerMessage.includes("already verified") ||
        lowerMessage.includes("email already verified")
      ) {
        sessionStorage.setItem(requestKey, "done");
        setStatus("success");
        toast.success("Email already verified!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      sessionStorage.removeItem(requestKey);
      setStatus("error");
      setError(message);
      toast.error(message);
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

          {status === "loading" && (
            <p className='mt-4 text-gray-500'>Loading...</p>
          )}

          {status === "error" && <p className='mt-4 text-red-500'>{error}</p>}

          {status === "success" && (
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
