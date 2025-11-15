"use client";
import { base_url } from "@/utils/utils";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleSubmit = async(e) => {
    setLoading(true)
    e.preventDefault();
try {

  
    console.log("Email:", email);
    console.log("Password:", password);
    const data = {email, password};

    const response = await axios.post(`${base_url}/user/login`, data);
    console.log(response?.data?.data, "Login hoise to opi");
   const res = await signIn("credentials", {
        redirect: false,
        email: response?.data?.data?.email,
        role: response?.data?.data?.role,
        _id: response?.data?.data?._id,
      });
    toast.success("Login Success")
    setLoading(false)
    
} catch (error) {
  console.log(error?.response?.data?.message, "This is error page")
    toast.error(error?.response?.data?.message)
    setLoading(false)
}
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Login</h2>

        {/* Email */}
        <div className="flex flex-col">
          <label className="font-medium">Email</label>
          <input
            type="email"
            className="border p-2 rounded"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="font-medium">Password</label>
          <input
            type="password"
            className="border p-2 rounded"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-rose-500 text-white py-2 rounded hover:bg-rose-600"
        >
        {
          loading ? "Loading..." : "Login"
        }
        </button>
      </form>
    </div>
  );
}
