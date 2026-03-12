import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const PaymentApi = createApi({
  reducerPath: "PaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = getCookie("token");

      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Subscription"],

  endpoints: (builder) => ({
    // Create a subscription → returns paymentLink for Stripe checkout
    createSubscription: builder.mutation({
      query: (data) => ({
        url: "/subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Get the logged-in user's latest subscription
    getMySubscription: builder.query({
      query: () => "/subscription/me",
      providesTags: ["Subscription"],
    }),

    // Get all subscriptions for the logged-in user (payment history)
    getMySubscriptionHistory: builder.query({
      query: ({ pageNo = 1, showPerPage = 10 } = {}) =>
        `/subscription/many?pageNo=${pageNo}&showPerPage=${showPerPage}`,
      providesTags: ["Subscription"],
    }),

    // Cancel an active subscription
    cancelSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/cancel/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),

    // Pick Purchase endpoints
    createPickPurchase: builder.mutation({
      query: (data) => ({
        url: "/picks/purchase",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PickPurchase"],
    }),

    getMyPickPurchases: builder.query({
      query: () => "/picks/my-purchases",
      providesTags: ["PickPurchase"],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetMySubscriptionQuery,
  useGetMySubscriptionHistoryQuery,
  useCancelSubscriptionMutation,
  useCreatePickPurchaseMutation,
  useGetMyPickPurchasesQuery,
} = PaymentApi;
