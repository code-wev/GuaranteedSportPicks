"use client";

import {
  useGetManyNewslatterQuery,
  useGetNewsletterCampaignsQuery,
  useGetUserNewsletterStatusQuery,
  useSendNewsletterCampaignMutation,
  useToggleNewsletterMutation,
} from "@/feature/NewslatterApi";
import { useMyProfileQuery } from "@/feature/UserApi";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FiMail, FiSend, FiUsers } from "react-icons/fi";

const initialForm = {
  title: "",
  subject: "",
  content: "",
};

function StatCard({ label, value }) {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 shadow-sm'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='mt-2 text-2xl font-semibold text-[#111827]'>{value}</p>
    </div>
  );
}

function UserNewsletterPanel() {
  const { data: newsletterData, isLoading, refetch } =
    useGetUserNewsletterStatusQuery();
  const [toggleNewsletter, { isLoading: isToggling }] =
    useToggleNewsletterMutation();

  const isActive = Boolean(newsletterData?.data?.isActive);
  const email = newsletterData?.data?.email;

  const handleToggle = async () => {
    try {
      await toggleNewsletter({ isActive: !isActive }).unwrap();
      toast.success(
        `Newsletter ${!isActive ? "enabled" : "disabled"} successfully.`,
      );
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.data?.error || "Failed to update newsletter.",
      );
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-semibold text-[#111827]'>
          Newsletter Settings
        </h1>
        <p className='mt-2 text-sm text-gray-600'>
          Manage your own newsletter subscription from here.
        </p>
      </div>

      <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-[#B91C1C]'>
              <FiMail className='text-xl' />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-[#111827]'>
                Email Updates
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                {email || "Your account email"} will receive picks, promos, and
                site updates when this is active.
              </p>
            </div>
          </div>

          <button
            type='button'
            disabled={isLoading || isToggling}
            onClick={handleToggle}
            className={`inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
              isActive
                ? "bg-[#B91C1C] text-white hover:bg-[#991B1B]"
                : "bg-gray-100 text-[#111827] hover:bg-gray-200"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isToggling
              ? "Updating..."
              : isActive
                ? "Turn Off Newsletter"
                : "Turn On Newsletter"}
          </button>
        </div>

        <div className='mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700'>
          Status:{" "}
          <span className='font-semibold text-[#111827]'>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}

function AdminNewsletterPanel() {
  const [searchKey, setSearchKey] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const { data: subscribersData, isLoading: subscribersLoading, refetch } =
    useGetManyNewslatterQuery({
      pageNo: 1,
      showPerPage: 100,
      searchKey,
    });
  const { data: campaignsData, isLoading: campaignsLoading } =
    useGetNewsletterCampaignsQuery();
  const [sendNewsletterCampaign, { isLoading: isSending }] =
    useSendNewsletterCampaignMutation();

  const subscribers = subscribersData?.data?.newslatters || [];
  const campaigns = campaignsData?.data?.campaigns || [];

  const activeSubscribers = subscribers.filter(
    (subscriber) => subscriber.isActive,
  ).length;
  const stats = {
    total: subscribers.length,
    active: activeSubscribers,
    inactive: subscribers.length - activeSubscribers,
  };

  const handleSend = async (event) => {
    event.preventDefault();

    try {
      const response = await sendNewsletterCampaign(formData).unwrap();
      toast.success(
        `Newsletter sent to ${response?.data?.recipientCount || 0} subscribers.`,
      );
      setFormData(initialForm);
      refetch();
    } catch (error) {
      toast.error(
        error?.data?.message || error?.data?.error || "Failed to send newsletter.",
      );
    }
  };

  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-[#111827]'>
            Newsletter Management
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            Manage subscribers and send email campaigns to active newsletter users.
          </p>
        </div>

        <div className='w-full md:w-72'>
          <label className='mb-1 block text-sm font-medium text-gray-600'>
            Search Subscriber
          </label>
          <input
            type='text'
            value={searchKey}
            onChange={(event) => setSearchKey(event.target.value)}
            placeholder='Search by email'
            className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <StatCard label='Total Subscribers' value={stats.total} />
        <StatCard label='Active Subscribers' value={stats.active} />
        <StatCard label='Inactive Subscribers' value={stats.inactive} />
      </div>

      <div className='grid gap-8 xl:grid-cols-[1.15fr_0.85fr]'>
        <section className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='mb-5 flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#B91C1C]'>
              <FiSend />
            </div>
            <div>
              <h2 className='text-xl font-semibold text-[#111827]'>
                Compose Newsletter
              </h2>
              <p className='text-sm text-gray-600'>
                This will email all active subscribers immediately.
              </p>
            </div>
          </div>

          <form onSubmit={handleSend} className='space-y-4'>
            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Campaign Title
              </label>
              <input
                type='text'
                value={formData.title}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, title: event.target.value }))
                }
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Weekend premium picks update'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Email Subject
              </label>
              <input
                type='text'
                value={formData.subject}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, subject: event.target.value }))
                }
                className='w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Your latest picks are ready'
                required
              />
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-600'>
                Email Content
              </label>
              <textarea
                value={formData.content}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, content: event.target.value }))
                }
                className='min-h-[220px] w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#B91C1C]'
                placeholder='Write your newsletter content here. Basic HTML is supported.'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isSending}
              className='inline-flex items-center gap-2 rounded-xl bg-[#B91C1C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#991B1B] disabled:cursor-not-allowed disabled:opacity-60'
            >
              <FiSend />
              {isSending ? "Sending..." : "Send Newsletter"}
            </button>
          </form>
        </section>

        <section className='space-y-8'>
          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-5 flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#B91C1C]'>
                <FiUsers />
              </div>
              <div>
                <h2 className='text-xl font-semibold text-[#111827]'>
                  Subscribers
                </h2>
                <p className='text-sm text-gray-600'>
                  Active users will receive admin campaigns.
                </p>
              </div>
            </div>

            <div className='max-h-[360px] overflow-auto'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='border-b border-gray-200 text-gray-500'>
                    <th className='pb-3 font-medium'>Email</th>
                    <th className='pb-3 font-medium'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersLoading ? (
                    <tr>
                      <td colSpan='2' className='py-4 text-gray-500'>
                        Loading subscribers...
                      </td>
                    </tr>
                  ) : subscribers.length ? (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className='border-b border-gray-100'>
                        <td className='py-3 text-[#111827]'>{subscriber.email}</td>
                        <td className='py-3'>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              subscriber.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {subscriber.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan='2' className='py-4 text-gray-500'>
                        No subscribers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
            <h2 className='text-xl font-semibold text-[#111827]'>
              Campaign History
            </h2>
            <div className='mt-5 space-y-4'>
              {campaignsLoading ? (
                <p className='text-sm text-gray-500'>Loading campaigns...</p>
              ) : campaigns.length ? (
                campaigns.map((campaign) => (
                  <div
                    key={campaign._id}
                    className='rounded-2xl border border-gray-200 p-4'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div>
                        <h3 className='font-semibold text-[#111827]'>
                          {campaign.title}
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                          {campaign.subject}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          campaign.status === "SENT"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>

                    <div className='mt-3 flex flex-wrap gap-4 text-xs text-gray-500'>
                      <span>Recipients: {campaign.recipientCount}</span>
                      <span>Sent: {campaign.successCount}</span>
                      <span>Failed: {campaign.failedCount}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-sm text-gray-500'>
                  No campaigns have been sent yet.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function NewslettersPage() {
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
      {role === "ADMIN" ? <AdminNewsletterPanel /> : <UserNewsletterPanel />}
    </main>
  );
}
