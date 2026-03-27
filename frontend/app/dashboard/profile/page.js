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
import { FiAlertTriangle, FiEye, FiEyeOff, FiLock, FiMail, FiSave, FiTrash2 } from "react-icons/fi";
import Cookies from "js-cookie";

export default function ProfileSettings() {
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteAcknowledged, setDeleteAcknowledged] = useState(false);
  
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
    confirmPassword: "",
    deletePassword: "",
    deleteEmail: "",
    deletePhrase: ""
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
    setProfileSaving(true);
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
      setProfileSaving(false);
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

    setPasswordSaving(true);
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
      setPasswordSaving(false);
    }
  };

  const deletePhraseMatches = formData.deletePhrase.trim() === "DELETE MY ACCOUNT";
  const deleteEmailMatches = formData.deleteEmail.trim().toLowerCase() === (profile?.email || "").toLowerCase();
  const canSubmitDelete =
    Boolean(formData.deletePassword) &&
    deletePhraseMatches &&
    deleteEmailMatches &&
    deleteAcknowledged &&
    !deleteSubmitting;

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deleteEmailMatches) {
      toast.error("Enter your exact account email to continue.");
      return;
    }

    if (!deletePhraseMatches) {
      toast.error('Type "DELETE MY ACCOUNT" exactly.');
      return;
    }

    if (!deleteAcknowledged) {
      toast.error("Please confirm that you understand this action is permanent.");
      return;
    }

    setDeleteSubmitting(true);
    try {
      await deleteUser({
        currentPassword: formData.deletePassword,
        email: formData.deleteEmail.trim(),
        confirmationText: formData.deletePhrase.trim(),
        acknowledgeRisk: true,
      }).unwrap();
      toast.success("Account deleted successfully.");
      Cookies.remove("token");
      window.location.href = "/login";
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete account.");
    } finally {
      setDeleteSubmitting(false);
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
                disabled={profileSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#B91C1C] text-white shadow-sm hover:bg-[#D32F2F] transition disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{profileSaving ? "Saving..." : "Update Profile"}</span>
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
                disabled={passwordSaving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-[#B91C1C] text-white shadow-sm hover:bg-[#D32F2F] transition disabled:opacity-50"
              >
                <FiSave className="w-4 h-4" />
                <span>{passwordSaving ? "Changing..." : "Change Password"}</span>
              </button>
            </div>
          </form>

          <hr className="border-gray-200 mb-8" />

          <section className="rounded-2xl border border-red-200 bg-[linear-gradient(135deg,#fff5f5_0%,#ffe4e6_100%)] p-5 md:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <FiAlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-950">Danger Zone</h2>
                    <p className="mt-1 text-sm text-red-900/80">
                      Account deletion is permanently destructive. We require multiple confirmations before this can be submitted.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmVisible((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-red-300 text-red-800 bg-white hover:bg-red-50 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>{deleteConfirmVisible ? "Close Danger Zone" : "Open Danger Zone"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-red-200 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Restriction 1</p>
                  <p className="mt-2 text-sm text-slate-700">Current password is required before any delete request is accepted.</p>
                </div>
                <div className="rounded-xl border border-red-200 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Restriction 2</p>
                  <p className="mt-2 text-sm text-slate-700">Exact account email and the phrase DELETE MY ACCOUNT must match exactly.</p>
                </div>
                <div className="rounded-xl border border-red-200 bg-white/80 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Restriction 3</p>
                  <p className="mt-2 text-sm text-slate-700">Backend blocks deletion if a subscription or payment is still active or processing.</p>
                </div>
              </div>

              {deleteConfirmVisible && (
                <form onSubmit={handleDeleteAccount} className="rounded-2xl border border-red-300 bg-white p-5">
                  <div className="flex items-center gap-2 mb-4 text-red-800">
                    <FiLock className="w-4 h-4" />
                    <p className="text-sm font-medium">Secure account deletion verification</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={formData.deletePassword}
                        onChange={(e) => handleInputChange("deletePassword", e.target.value)}
                        className="w-full h-11 px-3 rounded-md border border-red-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type Your Account Email</label>
                      <input
                        type="email"
                        value={formData.deleteEmail}
                        onChange={(e) => handleInputChange("deleteEmail", e.target.value)}
                        className="w-full h-11 px-3 rounded-md border border-red-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                        placeholder={profile?.email || "your@email.com"}
                      />
                      <p className={`mt-1 text-xs ${formData.deleteEmail ? (deleteEmailMatches ? "text-emerald-700" : "text-red-700") : "text-gray-500"}`}>
                        {formData.deleteEmail
                          ? deleteEmailMatches
                            ? "Email confirmation matched."
                            : "Email must exactly match your current account email."
                          : "Use your exact current account email."}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Type DELETE MY ACCOUNT</label>
                      <input
                        type="text"
                        value={formData.deletePhrase}
                        onChange={(e) => handleInputChange("deletePhrase", e.target.value)}
                        className="w-full h-11 px-3 rounded-md border border-red-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition uppercase"
                        placeholder="DELETE MY ACCOUNT"
                      />
                      <p className={`mt-1 text-xs ${formData.deletePhrase ? (deletePhraseMatches ? "text-emerald-700" : "text-red-700") : "text-gray-500"}`}>
                        {formData.deletePhrase
                          ? deletePhraseMatches
                            ? "Confirmation phrase matched."
                            : 'Phrase must be exactly "DELETE MY ACCOUNT".'
                          : "This extra step helps prevent accidental deletion."}
                      </p>
                    </div>

                    <label className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={deleteAcknowledged}
                        onChange={(e) => setDeleteAcknowledged(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-red-900">
                        I understand this action is permanent, cannot be undone, and may be blocked until all active billing or in-flight payments are resolved.
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      For security, the server will verify all confirmation fields again before deleting the account.
                    </p>
                    <button
                      type="submit"
                      disabled={!canSubmitDelete}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-md bg-red-700 text-white shadow-sm hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span>{deleteSubmitting ? "Deleting..." : "Permanently Delete Account"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
