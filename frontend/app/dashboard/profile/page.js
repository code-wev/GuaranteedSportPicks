"use client";

import {
  useGetUserNewsletterStatusQuery,
  useToggleNewsletterMutation
} from "@/feature/NewslatterApi";
import { useMyProfileQuery, useUpdateUserMutation, useDeleteUserMutation } from "@/feature/UserApi";
import { useChangePasswordMutation } from "@/feature/AuthApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiEye, FiEyeOff, FiMail, FiSave, FiTrash2 } from "react-icons/fi";
import Cookies from "js-cookie";

export default function ProfileSettings() {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  
  const { data: newsletterData, isLoading: newsletterLoading, refetch: refetchNewsletter } = useGetUserNewsletterStatusQuery();
  const isSubscribedForNewsLatter = newsletterData?.data?.isActive;

  const { data: profileData, isLoading: profileLoading } = useMyProfileQuery();
  const profile = profileData?.data;
  
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleNewsletter, { isLoading: togglingNewsletter }] = useToggleNewsletterMutation();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phoneNumber || "",
      }));
    }
  }, [profile]);

  // Update newsletter state when data is fetched
  useEffect(() => {
    if (isSubscribedForNewsLatter !== undefined) {
      setNewsletterEnabled(isSubscribedForNewsLatter);
    }
  }, [isSubscribedForNewsLatter]);

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
      await toggleNewsletter({ isActive: newStatus }).unwrap();
      setNewsletterEnabled(newStatus);
      toast.success(`Newsletter ${newStatus ? 'enabled' : 'disabled'} successfully!`);
      refetchNewsletter();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to toggle newsletter!");
    }
  };

  // Handle profile info update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone
      }).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      toast.error("Please enter your current password!");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long!");
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword
      }).unwrap();
      
      toast.success("Password changed successfully!");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    } catch (error) {
      toast.error(error?.data?.message || "Failed to change password!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser().unwrap();
        toast.success("Account deleted successfully.");
        Cookies.remove("token");
        window.location.href = "/login";
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete account.");
      }
    }
  };

  if (profileLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="min-h-screen py-8 md:px-8">
      <Toaster/>
      <div className="">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#111827] mb-6">
          Profile &amp; Settings
        </h1>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-8">
          {/* PROFILE INFO FORM */}
          <form onSubmit={handleUpdateProfile} className="mb-10">
            <div className="flex flex-col md:items-start gap-6 mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src="/avatar.png"
                    alt="Profile photo"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full h-11 px-3 rounded-md border border-gray-100 bg-gray-50 text-sm text-gray-500 focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full h-11 px-3 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#B91C1C] text-white shadow-sm hover:bg-[#D32F2F] transition disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{loading ? "Saving..." : "Update Profile"}</span>
              </button>
            </div>
          </form>

          {/* NEWSLETTER SECTION */}
          <div className="mb-10 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-[#B91C1C]" />
                <div>
                  <h3 className="font-medium text-gray-900">Newsletter Subscription</h3>
                  <p className="text-sm text-gray-600">Receive updates and offers via email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleNewsletterToggle}
                disabled={togglingNewsletter || newsletterLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  newsletterEnabled ? 'bg-[#B91C1C]' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${newsletterEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <hr className="border-gray-200 mb-10" />

          {/* PASSWORD CHANGE FORM */}
          <form onSubmit={handleChangePassword} className="mb-10">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Change Password</h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={currentPasswordVisible ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                  <button type="button" className="absolute inset-y-0 right-3 text-gray-400" onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}>
                    {currentPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={newPasswordVisible ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                  <button type="button" className="absolute inset-y-0 right-3 text-gray-400" onClick={() => setNewPasswordVisible(!newPasswordVisible)}>
                    {newPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full h-11 pl-3 pr-10 rounded-md border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#B91C1C] transition"
                  />
                  <button type="button" className="absolute inset-y-0 right-3 text-gray-400" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    {confirmPasswordVisible ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#B91C1C] text-white shadow-sm hover:bg-[#D32F2F] transition disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{loading ? "Changing..." : "Change Password"}</span>
              </button>
            </div>
          </form>

          <hr className="border-gray-200 mb-8" />

          <div className="flex justify-start">
            <button
              onClick={handleDeleteAccount}
              type="button"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-[#EF4444] text-[#B91C1C] bg-[#FEF2F2] hover:bg-[#FEE2E2] transition"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
