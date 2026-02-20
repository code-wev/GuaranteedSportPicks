"use client";

import { useState } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff, FiTrash2, FiSave } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { base_url } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useGetSingleUserQuery } from "@/feature/UserApi";

export default function ProfileSettings() {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading]  = useState(false)

  const { data } = useSession();
  console.log(data?.user?.email, "user email");

  const {data:profile, isLoading, error, isError} = useGetSingleUserQuery(data?.user?.id);
  console.log(profile, "Profile is defined")
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: data?.user?.email || "",
    phone: "+1 (555) 123-4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {

    setLoading(true)
    e.preventDefault();
    
    // Log the required fields to console
    console.log("📧 Form Submission Data:", {
      email: formData.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    // Check if current password is provided
    if (!formData.currentPassword) {
      toast.error("Please enter your current password!");
      return;
    }

    // Create payload with correct variable names
    const payload = {
      email: data?.user?.email,
      oldPassword: formData.currentPassword, // Use formData.currentPassword
      newPassword: formData.newPassword // Use formData.newPassword
    };

    console.log("🚀 Sending payload:", payload);

    try {
      const response = await axios.put(`${base_url}/changePassword`, payload);
      console.log(response, "this is response");
              toast.success("Password changed successfully!");
      
      if (response.data.success) {
        toast.success("Password changed successfully!");
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      }


      
    } catch (error) {
      console.log(error.response?.data?.message, "error occurred");
      // Fix error handling - axios errors are in error.response
      toast.error(error.response?.data?.message || "Something went wrong!");
    }finally{
            setLoading(false)
    }
  };

  return (
    <main className="min-h-screen py-8 md:px-8">
      <Toaster/>
      <div className="">
        {/* PAGE TITLE */}
        <h1 className="text-2xl md:text-3xl font-semibold text-[#111827] mb-6">
          Profile &amp; Settings
        </h1>

        {/* CARD */}
        <form onSubmit={handleSubmit}>
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-8">
            {/* AVATAR + NAME / CONTACT */}
            <div className="flex flex-col md:items-start gap-6 mb-8">
              {/* Avatar */}
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src="/dashboard/profile.png" // put your image in /public
                    alt="Profile photo"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Contact Fields */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* First Name */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                </div>

                {/* Last Name */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                </div>

                {/* Email */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                    readOnly // Make email read-only since it comes from session
                  />
                </div>

                {/* Phone */}
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <hr className="border-gray-200 mb-6" />

            {/* CHANGE PASSWORD */}
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-[#111827] mb-4">
                Change Password
              </h2>

              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={currentPasswordVisible ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      setCurrentPasswordVisible(!currentPasswordVisible)
                    }
                  >
                    {currentPasswordVisible ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                  >
                    {newPasswordVisible ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:border-[#F97362] transition"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* BUTTON ROW */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-[#EF4444] text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#EF4444] text-white shadow-sm hover:bg-[#D32F2F] transition self-end sm:self-auto"
              >
                <FiSave className="w-4 h-4" />
                <span>

{

loading ? "Loading..." : "Save Changes"
}

                </span>
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}