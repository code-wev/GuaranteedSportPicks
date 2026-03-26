"use client";

import {
  useApproveAffiliateRequestMutation,
  useCreateAffiliateRequestMutation,
  useGetAffiliateAdminSummaryQuery,
  useGetManyAffiliateQuery,
  useGetMyAffiliateQuery,
  useUpdateAffiliateRequestMutation,
} from "@/feature/AffiliateApi";
import { useMyProfileQuery } from "@/feature/UserApi";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiClock, FiDollarSign, FiUsers } from "react-icons/fi";

const emptyForm = {
  website: "",
  socialLinks: "",
  notes: "",
};

function MetricCard({ label, value }) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-[#111827]'>{value}</p>
    </div>
  );
}

function UserAffiliatePanel() {
  const { data, isLoading, refetch } = useGetMyAffiliateQuery();
  const [createRequest, { isLoading: isCreating }] =
    useCreateAffiliateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] =
    useUpdateAffiliateRequestMutation();
  const [formData, setFormData] = useState(emptyForm);
  const [isDirty, setIsDirty] = useState(false);

  const summary = data?.data;
  const affiliate = summary?.affiliate;
  const activeFormData =
    !isDirty && affiliate
      ? {
          website: affiliate.website || "",
          socialLinks: Array.isArray(affiliate.socialLinks)
            ? affiliate.socialLinks.join(", ")
            : "",
          notes: affiliate.notes || "",
        }
      : formData;

  const submitForm = async (event) => {
    event.preventDefault();

    const payload = {
      website: activeFormData.website.trim() || undefined,
      socialLinks: activeFormData.socialLinks
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      notes: activeFormData.notes.trim() || undefined,
    };

    try {
      if (affiliate?._id) {
        await updateRequest({ id: affiliate._id, body: payload }).unwrap();
        toast.success("Affiliate request updated successfully.");
      } else {
        await createRequest(payload).unwrap();
        toast.success("Affiliate request submitted successfully.");
      }

      setIsDirty(false);
      setFormData(emptyForm);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.data?.error || "Failed to save affiliate request.",
      );
    }
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-semibold text-[#111827]'>
          Affiliate Program
        </h1>
        <p className='mt-2 max-w-2xl text-sm text-gray-600'>
          Apply as an affiliate, get approved by admin, receive your unique key,
          and earn commission from referred subscription sales.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <MetricCard label='Referral Signups' value={summary?.referralCount || 0} />
        <MetricCard
          label='Commission Rate'
          value={`${summary?.commissionRate || 0}%`}
        />
        <MetricCard
          label='Total Commission'
          value={`$${Number(summary?.totalCommission || 0).toFixed(2)}`}
        />
      </div>

      <div className='grid gap-8 xl:grid-cols-[0.95fr_1.05fr]'>
        <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-[#111827]'>
            {affiliate?._id ? "Affiliate Request Details" : "Request Affiliate Access"}
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            {affiliate?._id
              ? "Update your affiliate profile information while admin reviews or manages your request."
              : "Submit your affiliate application. Admin approval is required before you receive a referral key."}
          </p>

          <form onSubmit={submitForm} className='mt-6 space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Website
              </label>
              <input
                type='text'
                value={activeFormData.website}
                onChange={(event) => {
                  setIsDirty(true);
                  setFormData((prev) => ({ ...prev, website: event.target.value }));
                }}
                placeholder='https://yourwebsite.com'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Social Links
              </label>
              <input
                type='text'
                value={activeFormData.socialLinks}
                onChange={(event) => {
                  setIsDirty(true);
                  setFormData((prev) => ({
                    ...prev,
                    socialLinks: event.target.value,
                  }));
                }}
                placeholder='Comma separated links'
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Notes
              </label>
              <textarea
                value={activeFormData.notes}
                onChange={(event) => {
                  setIsDirty(true);
                  setFormData((prev) => ({ ...prev, notes: event.target.value }));
                }}
                placeholder='Tell the admin about your traffic source or audience.'
                className='min-h-[140px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
              />
            </div>

            <button
              type='submit'
              disabled={isCreating || isUpdating}
              className='rounded-xl bg-[#B91C1C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isCreating || isUpdating
                ? "Saving..."
                : affiliate?._id
                  ? "Update Request"
                  : "Submit Request"}
            </button>
          </form>
        </section>

        <section className='space-y-6'>
          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-[#111827]'>
              Current Status
            </h2>
            {isLoading ? (
              <p className='mt-4 text-sm text-gray-500'>Loading...</p>
            ) : affiliate ? (
              <div className='mt-5 space-y-4'>
                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Status</p>
                  <p className='mt-1 text-lg font-semibold text-[#111827] capitalize'>
                    {affiliate.status}
                  </p>
                </div>

                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Affiliate Key</p>
                  <p className='mt-1 break-all text-lg font-semibold text-[#111827]'>
                    {affiliate.affiliateCode || "Available after approval"}
                  </p>
                </div>

                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Referral Signup Link</p>
                  <p className='mt-1 break-all text-sm text-[#111827]'>
                    {affiliate.affiliateCode
                      ? `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${affiliate.affiliateCode}`
                      : "Your signup link will appear after admin approval."}
                  </p>
                </div>
              </div>
            ) : (
              <p className='mt-4 text-sm text-gray-500'>
                No affiliate request yet. Submit one to get started.
              </p>
            )}
          </div>

          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-[#111827]'>
              Recent Commissions
            </h2>
            <div className='mt-5 space-y-4'>
              {summary?.commissions?.length ? (
                summary.commissions.map((commission) => (
                  <div
                    key={commission._id}
                    className='rounded-2xl border border-gray-200 p-4'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <p className='font-semibold text-[#111827]'>
                          {commission.referredUserId?.email || "Referred subscriber"}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {commission.sourceType} payment
                        </p>
                      </div>
                      <p className='text-lg font-semibold text-[#111827]'>
                        ${Number(commission.commissionAmount || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>
                  No commissions yet. Once referred users buy subscriptions, they will appear here.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AdminAffiliatePanel() {
  const [searchKey, setSearchKey] = useState("");
  const { data: summaryData } = useGetAffiliateAdminSummaryQuery();
  const { data: affiliatesData, isLoading, refetch } = useGetManyAffiliateQuery({
    pageNo: 1,
    showPerPage: 100,
    searchKey,
  });
  const [approveRequest, { isLoading: isApproving }] =
    useApproveAffiliateRequestMutation();

  const summary = summaryData?.data;
  const affiliates = affiliatesData?.data?.affiliates || [];

  const handleDecision = async (id, status) => {
    try {
      await approveRequest({
        id,
        body: { status },
      }).unwrap();
      toast.success(`Affiliate request ${status} successfully.`);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.data?.error || "Failed to update affiliate request.",
      );
    }
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-[#111827]'>
            Affiliate Management
          </h1>
          <p className='mt-2 max-w-2xl text-sm text-gray-600'>
            Approve affiliate applications, issue referral keys, and monitor commission performance.
          </p>
        </div>

        <div className='w-full md:w-72'>
          <label className='mb-1 block text-sm font-medium text-gray-600'>
            Search Requests
          </label>
          <input
            type='text'
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
            placeholder='Search by email or code'
            className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <MetricCard label='Total Requests' value={summary?.totalRequests || 0} />
        <MetricCard
          label='Approved Affiliates'
          value={summary?.approvedAffiliates || 0}
        />
        <MetricCard
          label='Pending Requests'
          value={summary?.pendingAffiliates || 0}
        />
        <MetricCard
          label='Total Commission'
          value={`$${Number(summary?.totalCommission || 0).toFixed(2)}`}
        />
      </div>

      <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-gray-200 text-gray-500'>
                <th className='pb-4 font-medium'>Affiliate</th>
                <th className='pb-4 font-medium'>Status</th>
                <th className='pb-4 font-medium'>Key</th>
                <th className='pb-4 font-medium'>Referrals</th>
                <th className='pb-4 font-medium'>Commission</th>
                <th className='pb-4 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan='6' className='py-6 text-gray-500'>
                    Loading affiliate requests...
                  </td>
                </tr>
              ) : affiliates.length ? (
                affiliates.map((affiliate) => (
                  <tr key={affiliate._id} className='border-b border-gray-100'>
                    <td className='py-4'>
                      <p className='font-semibold text-[#111827]'>
                        {affiliate.userId?.firstName} {affiliate.userId?.lastName}
                      </p>
                      <p className='text-xs text-gray-500'>{affiliate.userId?.email}</p>
                    </td>
                    <td className='py-4'>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          affiliate.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : affiliate.status === "declined"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {affiliate.status}
                      </span>
                    </td>
                    <td className='py-4 text-[#111827]'>
                      {affiliate.affiliateCode || "Pending approval"}
                    </td>
                    <td className='py-4'>{affiliate.referralCount || 0}</td>
                    <td className='py-4'>
                      ${Number(affiliate.totalCommission || 0).toFixed(2)}
                    </td>
                    <td className='py-4'>
                      <div className='flex flex-wrap gap-2'>
                        <button
                          type='button'
                          disabled={isApproving || affiliate.status === "approved"}
                          onClick={() => handleDecision(affiliate._id, "approved")}
                          className='rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'
                        >
                          Approve
                        </button>
                        <button
                          type='button'
                          disabled={isApproving || affiliate.status === "declined"}
                          onClick={() => handleDecision(affiliate._id, "declined")}
                          className='rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='6' className='py-6 text-gray-500'>
                    No affiliate requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FiClock className='text-xl text-amber-600' />
            <div>
              <p className='text-sm text-gray-500'>Pending Reviews</p>
              <p className='text-lg font-semibold text-[#111827]'>
                {summary?.pendingAffiliates || 0}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FiUsers className='text-xl text-blue-600' />
            <div>
              <p className='text-sm text-gray-500'>Active Partners</p>
              <p className='text-lg font-semibold text-[#111827]'>
                {summary?.approvedAffiliates || 0}
              </p>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='flex items-center gap-3'>
            <FiDollarSign className='text-xl text-green-600' />
            <div>
              <p className='text-sm text-gray-500'>Commission Rate</p>
              <p className='text-lg font-semibold text-[#111827]'>
                {summary?.commissionRate || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  const { data: profileData, isLoading } = useMyProfileQuery();
  const role = profileData?.data?.role;

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center text-gray-500'>
        Loading...
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-[#F9FAFB] p-6 md:p-8'>
      <Toaster />
      {role === "ADMIN" ? <AdminAffiliatePanel /> : <UserAffiliatePanel />}
    </main>
  );
}
