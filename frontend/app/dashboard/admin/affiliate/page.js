"use client";

import {
  useApproveAffiliateRequestMutation,
  useCreateAffiliateRequestMutation,
  useCreateWithdrawalRequestMutation,
  useGetAffiliateAdminSummaryQuery,
  useGetManyAffiliateQuery,
  useGetMyAffiliateQuery,
  useGetWithdrawalRequestsQuery,
  useRetryWithdrawalRequestMutation,
  useUpdateAffiliateRequestMutation,
  useUpdateWithdrawalRequestMutation,
} from "@/feature/AffiliateApi";
import { useMyProfileQuery } from "@/feature/UserApi";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiClock, FiDollarSign, FiUsers } from "react-icons/fi";

const emptyForm = { website: "", socialLinks: "", notes: "" };
const emptyWithdrawalForm = {
  amount: "",
  payoutMethod: "",
  payoutDetails: "",
  note: "",
};

function MetricCard({ label, value }) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-[#111827]'>{value}</p>
    </div>
  );
}

function statusClass(status) {
  if (status === "approved" || status === "PAID") return "bg-green-100 text-green-700";
  if (status === "declined" || status === "REJECTED") return "bg-red-100 text-red-700";
  if (status === "PROCESSING") return "bg-blue-100 text-blue-700";
  if (status === "RETRY_REQUESTED") return "bg-purple-100 text-purple-700";
  return "bg-amber-100 text-amber-700";
}

function UserAffiliatePanel() {
  const { data, isLoading, refetch } = useGetMyAffiliateQuery();
  const [createRequest, { isLoading: isCreating }] = useCreateAffiliateRequestMutation();
  const [updateRequest, { isLoading: isUpdating }] = useUpdateAffiliateRequestMutation();
  const [createWithdrawal, { isLoading: isCreatingWithdrawal }] =
    useCreateWithdrawalRequestMutation();
  const [retryWithdrawal, { isLoading: isRetryingWithdrawal }] =
    useRetryWithdrawalRequestMutation();
  const [formData, setFormData] = useState(emptyForm);
  const [withdrawalForm, setWithdrawalForm] = useState(emptyWithdrawalForm);
  const [isDirty, setIsDirty] = useState(false);

  const summary = data?.data;
  const affiliate = summary?.affiliate;
  const withdrawals = summary?.withdrawals || [];
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
      toast.error(error?.data?.message || error?.data?.error || "Failed to save affiliate request.");
    }
  };

  const handleWithdrawalSubmit = async (event) => {
    event.preventDefault();

    try {
      await createWithdrawal({
        amount: Number(withdrawalForm.amount),
        payoutMethod: withdrawalForm.payoutMethod,
        payoutDetails: withdrawalForm.payoutDetails,
        note: withdrawalForm.note || undefined,
      }).unwrap();
      toast.success("Withdrawal request submitted successfully.");
      setWithdrawalForm(emptyWithdrawalForm);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.data?.error || "Failed to submit withdrawal request.",
      );
    }
  };

  const handleRetry = async (withdrawalId) => {
    try {
      await retryWithdrawal({
        id: withdrawalId,
        body: { note: "I have not received this transfer yet." },
      }).unwrap();
      toast.success("Retry request sent to admin.");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.error || "Failed to submit retry request.");
    }
  };

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-semibold text-[#111827]'>Affiliate Program</h1>
        <p className='mt-2 max-w-2xl text-sm text-gray-600'>
          Apply as an affiliate, get approved by admin, receive your unique key, earn
          commission from referred subscription sales, and request manual withdrawals.
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <MetricCard label='Referral Signups' value={summary?.referralCount || 0} />
        <MetricCard label='Commission Rate' value={`${summary?.commissionRate || 0}%`} />
        <MetricCard label='Total Commission' value={`$${Number(summary?.totalCommission || 0).toFixed(2)}`} />
        <MetricCard label='Available Balance' value={`$${Number(summary?.availableBalance || 0).toFixed(2)}`} />
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
            <input
              type='text'
              value={activeFormData.website}
              onChange={(event) => {
                setIsDirty(true);
                setFormData((prev) => ({ ...prev, website: event.target.value }));
              }}
              placeholder='Website'
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
            />
            <input
              type='text'
              value={activeFormData.socialLinks}
              onChange={(event) => {
                setIsDirty(true);
                setFormData((prev) => ({ ...prev, socialLinks: event.target.value }));
              }}
              placeholder='Comma separated social links'
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
            />
            <textarea
              value={activeFormData.notes}
              onChange={(event) => {
                setIsDirty(true);
                setFormData((prev) => ({ ...prev, notes: event.target.value }));
              }}
              placeholder='Notes'
              className='min-h-[140px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
            />
            <button
              type='submit'
              disabled={isCreating || isUpdating}
              className='rounded-xl bg-[#B91C1C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isCreating || isUpdating ? "Saving..." : affiliate?._id ? "Update Request" : "Submit Request"}
            </button>
          </form>
        </section>

        <section className='space-y-6'>
          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-[#111827]'>Current Status</h2>
            {isLoading ? (
              <p className='mt-4 text-sm text-gray-500'>Loading...</p>
            ) : affiliate ? (
              <div className='mt-5 space-y-4'>
                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Status</p>
                  <p className='mt-1 text-lg font-semibold text-[#111827] capitalize'>{affiliate.status}</p>
                </div>
                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Affiliate Key</p>
                  <p className='mt-1 break-all text-lg font-semibold text-[#111827]'>
                    {affiliate.affiliateCode || "Available after approval"}
                  </p>
                </div>
                <div className='rounded-2xl bg-gray-50 p-4'>
                  <p className='text-sm text-gray-500'>Paid Out</p>
                  <p className='mt-1 text-lg font-semibold text-[#111827]'>
                    ${Number(summary?.paidOut || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <p className='mt-4 text-sm text-gray-500'>No affiliate request yet. Submit one to get started.</p>
            )}
          </div>

          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-[#111827]'>Request Withdrawal</h2>
            <form onSubmit={handleWithdrawalSubmit} className='mt-5 space-y-4'>
              <input
                type='number'
                min='1'
                step='0.01'
                value={withdrawalForm.amount}
                onChange={(event) => setWithdrawalForm((prev) => ({ ...prev, amount: event.target.value }))}
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Amount'
              />
              <input
                type='text'
                value={withdrawalForm.payoutMethod}
                onChange={(event) =>
                  setWithdrawalForm((prev) => ({ ...prev, payoutMethod: event.target.value }))
                }
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Bank transfer / Stripe / eBN / other'
              />
              <textarea
                value={withdrawalForm.payoutDetails}
                onChange={(event) =>
                  setWithdrawalForm((prev) => ({ ...prev, payoutDetails: event.target.value }))
                }
                className='min-h-[110px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Bank account, Stripe email, payout details'
              />
              <textarea
                value={withdrawalForm.note}
                onChange={(event) => setWithdrawalForm((prev) => ({ ...prev, note: event.target.value }))}
                className='min-h-[90px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Optional note'
              />
              <button
                type='submit'
                disabled={isCreatingWithdrawal || !affiliate?.affiliateCode || Number(summary?.availableBalance || 0) <= 0}
                className='rounded-xl bg-[#B91C1C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
              >
                {isCreatingWithdrawal ? "Submitting..." : "Submit Withdrawal Request"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className='grid gap-8 xl:grid-cols-2'>
        <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-[#111827]'>Recent Commissions</h2>
          <div className='mt-5 space-y-4'>
            {summary?.commissions?.length ? (
              summary.commissions.map((commission) => (
                <div key={commission._id} className='rounded-2xl border border-gray-200 p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='font-semibold text-[#111827]'>
                        {commission.referredUserId?.email || "Referred subscriber"}
                      </p>
                      <p className='text-xs text-gray-500'>{commission.sourceType} payment</p>
                    </div>
                    <p className='text-lg font-semibold text-[#111827]'>
                      ${Number(commission.commissionAmount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500'>No commissions yet.</p>
            )}
          </div>
        </section>

        <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <h2 className='text-xl font-semibold text-[#111827]'>Withdrawal History</h2>
          <div className='mt-5 space-y-4'>
            {withdrawals.length ? (
              withdrawals.map((withdrawal) => (
                <div key={withdrawal._id} className='rounded-2xl border border-gray-200 p-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='font-semibold text-[#111827]'>
                        ${Number(withdrawal.amount || 0).toFixed(2)} via {withdrawal.payoutMethod}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>{withdrawal.payoutDetails}</p>
                      {withdrawal.transferReference ? (
                        <p className='mt-1 text-xs text-gray-500'>Ref: {withdrawal.transferReference}</p>
                      ) : null}
                      {withdrawal.adminNote ? (
                        <p className='mt-1 text-xs text-gray-500'>Admin note: {withdrawal.adminNote}</p>
                      ) : null}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(withdrawal.status)}`}>
                      {withdrawal.status}
                    </span>
                  </div>
                  {withdrawal.status === "PAID" ? (
                    <button
                      type='button'
                      disabled={isRetryingWithdrawal}
                      onClick={() => handleRetry(withdrawal._id)}
                      className='mt-4 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'
                    >
                      I Did Not Receive This
                    </button>
                  ) : null}
                </div>
              ))
            ) : (
              <p className='text-sm text-gray-500'>No withdrawal requests yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function AdminAffiliatePanel() {
  const [searchKey, setSearchKey] = useState("");
  const [withdrawalSearch, setWithdrawalSearch] = useState("");
  const [adminForms, setAdminForms] = useState({});
  const { data: summaryData } = useGetAffiliateAdminSummaryQuery();
  const { data: affiliatesData, isLoading, refetch } = useGetManyAffiliateQuery({
    pageNo: 1,
    showPerPage: 100,
    searchKey,
  });
  const { data: withdrawalsData, isLoading: withdrawalsLoading, refetch: refetchWithdrawals } =
    useGetWithdrawalRequestsQuery({
      pageNo: 1,
      showPerPage: 100,
      searchKey: withdrawalSearch,
    });
  const [approveRequest, { isLoading: isApproving }] = useApproveAffiliateRequestMutation();
  const [updateWithdrawal, { isLoading: isUpdatingWithdrawal }] = useUpdateWithdrawalRequestMutation();

  const summary = summaryData?.data;
  const affiliates = affiliatesData?.data?.affiliates || [];
  const withdrawals = withdrawalsData?.data?.withdrawals || [];

  const handleDecision = async (id, status) => {
    try {
      await approveRequest({ id, body: { status } }).unwrap();
      toast.success(`Affiliate request ${status} successfully.`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.error || "Failed to update affiliate request.");
    }
  };

  const handleWithdrawalAction = async (id, status) => {
    const form = adminForms[id] || {};
    try {
      await updateWithdrawal({
        id,
        body: {
          status,
          adminNote: form.adminNote || undefined,
          transferReference: form.transferReference || undefined,
        },
      }).unwrap();
      toast.success(`Withdrawal marked as ${status}.`);
      refetchWithdrawals();
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.error || "Failed to update withdrawal request.");
    }
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-[#111827]'>Affiliate Management</h1>
          <p className='mt-2 max-w-2xl text-sm text-gray-600'>
            Approve affiliate applications, issue referral keys, monitor commissions, and manually process withdrawals.
          </p>
        </div>
        <div className='w-full md:w-72'>
          <label className='mb-1 block text-sm font-medium text-gray-600'>Search Requests</label>
          <input
            type='text'
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
            placeholder='Search by email or code'
            className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-5'>
        <MetricCard label='Total Requests' value={summary?.totalRequests || 0} />
        <MetricCard label='Approved Affiliates' value={summary?.approvedAffiliates || 0} />
        <MetricCard label='Pending Requests' value={summary?.pendingAffiliates || 0} />
        <MetricCard label='Total Commission' value={`$${Number(summary?.totalCommission || 0).toFixed(2)}`} />
        <MetricCard label='Paid Out' value={`$${Number(summary?.totalPaidOut || 0).toFixed(2)}`} />
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
                <tr><td colSpan='6' className='py-6 text-gray-500'>Loading affiliate requests...</td></tr>
              ) : affiliates.length ? (
                affiliates.map((affiliate) => (
                  <tr key={affiliate._id} className='border-b border-gray-100'>
                    <td className='py-4'>
                      <p className='font-semibold text-[#111827]'>{affiliate.userId?.firstName} {affiliate.userId?.lastName}</p>
                      <p className='text-xs text-gray-500'>{affiliate.userId?.email}</p>
                    </td>
                    <td className='py-4'>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(affiliate.status)}`}>
                        {affiliate.status}
                      </span>
                    </td>
                    <td className='py-4 text-[#111827]'>{affiliate.affiliateCode || "Pending approval"}</td>
                    <td className='py-4'>{affiliate.referralCount || 0}</td>
                    <td className='py-4'>${Number(affiliate.totalCommission || 0).toFixed(2)}</td>
                    <td className='py-4'>
                      <div className='flex flex-wrap gap-2'>
                        <button type='button' disabled={isApproving || affiliate.status === "approved"} onClick={() => handleDecision(affiliate._id, "approved")} className='rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'>Approve</button>
                        <button type='button' disabled={isApproving || affiliate.status === "declined"} onClick={() => handleDecision(affiliate._id, "declined")} className='rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'>Decline</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan='6' className='py-6 text-gray-500'>No affiliate requests found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-[#111827]'>Withdrawal Requests</h2>
            <p className='mt-1 text-sm text-gray-600'>Review payout details, transfer manually outside the website, then mark the request.</p>
          </div>
          <div className='w-full md:w-72'>
            <label className='mb-1 block text-sm font-medium text-gray-600'>Search Withdrawals</label>
            <input
              type='text'
              value={withdrawalSearch}
              onChange={(event) => setWithdrawalSearch(event.target.value)}
              placeholder='Search by method or details'
              className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
            />
          </div>
        </div>
        <div className='space-y-4'>
          {withdrawalsLoading ? (
            <p className='text-sm text-gray-500'>Loading withdrawal requests...</p>
          ) : withdrawals.length ? (
            withdrawals.map((withdrawal) => {
              const form = adminForms[withdrawal._id] || {};
              return (
                <div key={withdrawal._id} className='rounded-2xl border border-gray-200 p-5'>
                  <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-3'>
                        <p className='text-lg font-semibold text-[#111827]'>${Number(withdrawal.amount || 0).toFixed(2)}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(withdrawal.status)}`}>{withdrawal.status}</span>
                      </div>
                      <p className='text-sm text-gray-700'>{withdrawal.userId?.firstName} {withdrawal.userId?.lastName} ({withdrawal.userId?.email})</p>
                      <p className='text-sm text-gray-600'>Method: {withdrawal.payoutMethod}</p>
                      <p className='text-sm text-gray-600'>Details: {withdrawal.payoutDetails}</p>
                      {withdrawal.note ? <p className='text-sm text-gray-600'>User note: {withdrawal.note}</p> : null}
                      {withdrawal.transferReference ? <p className='text-sm text-gray-600'>Reference: {withdrawal.transferReference}</p> : null}
                    </div>
                    <div className='w-full max-w-md space-y-3'>
                      <input
                        type='text'
                        value={form.transferReference || ""}
                        onChange={(event) =>
                          setAdminForms((prev) => ({
                            ...prev,
                            [withdrawal._id]: { ...prev[withdrawal._id], transferReference: event.target.value },
                          }))
                        }
                        className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                        placeholder='Manual transfer reference / transaction id'
                      />
                      <textarea
                        value={form.adminNote || ""}
                        onChange={(event) =>
                          setAdminForms((prev) => ({
                            ...prev,
                            [withdrawal._id]: { ...prev[withdrawal._id], adminNote: event.target.value },
                          }))
                        }
                        className='min-h-[90px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                        placeholder='Internal note for this payout'
                      />
                      <div className='flex flex-wrap gap-2'>
                        <button type='button' disabled={isUpdatingWithdrawal || withdrawal.status === "PROCESSING"} onClick={() => handleWithdrawalAction(withdrawal._id, "PROCESSING")} className='rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'>Mark Processing</button>
                        <button type='button' disabled={isUpdatingWithdrawal || withdrawal.status === "PAID"} onClick={() => handleWithdrawalAction(withdrawal._id, "PAID")} className='rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'>Confirm Paid</button>
                        <button type='button' disabled={isUpdatingWithdrawal || withdrawal.status === "REJECTED"} onClick={() => handleWithdrawalAction(withdrawal._id, "REJECTED")} className='rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50'>Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='text-sm text-gray-500'>No withdrawal requests found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  const { data: profileData, isLoading } = useMyProfileQuery();
  const role = profileData?.data?.role;

  if (isLoading) {
    return <div className='flex min-h-screen items-center justify-center text-gray-500'>Loading...</div>;
  }

  return (
    <main className='min-h-screen bg-[#F9FAFB] p-6 md:p-8'>
      <Toaster />
      {role === "ADMIN" ? <AdminAffiliatePanel /> : <UserAffiliatePanel />}
    </main>
  );
}
