"use client";

import {
  useGetUserNewsletterStatusQuery,
  useToggleNewsletterMutation
} from "@/feature/NewslatterApi";
import { useGetSingleUserQuery } from "@/feature/UserApi";
import { base_url } from "@/utils/utils";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff, FiMail, FiSave, FiTrash2 } from "react-icons/fi";

export default function ProfileSettings() {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const {data, isLoading: newsletterLoading, refetch: refetchNewsletter} =   useGetUserNewsletterStatusQuery();
  console.log(data?.data?.isActive, 'news latter status');
  const isSubscribedForNewsLatter = data?.data?.isActive;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const {data: profile, isLoading, error, isError} = useGetSingleUserQuery(user?.id);
  console.log(profile, "Profile is defined");
  
  // Toggle newsletter mutation
  const [toggleNewsletter, { isLoading: togglingNewsletter }] = useToggleNewsletterMutation();

  // Update newsletter state when data is fetched
  useEffect(() => {
    if (isSubscribedForNewsLatter !== undefined) {
      setNewsletterEnabled(isSubscribedForNewsLatter);
    } else {
      setNewsletterEnabled(false); // Default to false if no subscription
    }
  }, [isSubscribedForNewsLatter]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "Alex",
    lastName: profile?.lastName || "Johnson",
    email: user?.email || "",
    phone: profile?.phoneNumber || "+1 (555) 123-4567",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || prev.firstName,
        lastName: profile.lastName || prev.lastName,
        phone: profile.phoneNumber || prev.phone,
      }));
    }
  }, [profile]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle newsletter toggle
  const handleNewsletterToggle = async () => {


    try {
      const newStatus = !newsletterEnabled;
      const response = await toggleNewsletter({ status: newStatus }).unwrap();

      if (response.success) {
        setNewsletterEnabled(newStatus);
        alert(`Newsletter ${newStatus ? 'enabled' : 'disabled'} successfully!`);
        refetchNewsletter(); // Refresh status
      }
    } catch (error) {
      console.error("Newsletter toggle error:", error);
      alert(error?.data?.message || "Failed to toggle newsletter!");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    // Log the required fields to console
    console.log("📧 Form Submission Data:", {
      email: formData.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
      newsletter: newsletterEnabled
    });

    // Check if passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      setLoading(false);
      return;
    }

    // Check if current password is provided
    if (!formData.currentPassword) {
      toast.error("Please enter your current password!");
      setLoading(false);
      return;
    }

    // Create payload with correct variable names
    const payload = {
      email: user?.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    };

    console.log("🚀 Sending payload:", payload);

    try {
      const response = await axios.put(`${base_url}/changePassword`, payload, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(response, "this is response");
      
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
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
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
                    src="/dashboard/profile.png"
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
                    readOnly
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

            {/* NEWSLETTER SECTION */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-[#F97362]" />
                  <div>
                    <h3 className="font-medium text-gray-900">Newsletter Subscription</h3>
                    <p className="text-sm text-gray-600">
                      Receive updates and offers via email
                    </p>
                  </div>
                </div>
                {newsletterLoading ? (
                  <p className="text-xs text-gray-500">Loading status...</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleNewsletterToggle}
                    disabled={togglingNewsletter}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97362] focus:ring-offset-2 ${
                      newsletterEnabled ? 'bg-[#F97362]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        newsletterEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
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
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#EF4444] text-white shadow-sm hover:bg-[#D32F2F] transition self-end sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4" />
                <span>
                  {loading ? "Saving..." : "Save Changes"}
                </span>
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}