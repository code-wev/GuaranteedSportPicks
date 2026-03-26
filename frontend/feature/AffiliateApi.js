import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const AffiliateApi = createApi({
  reducerPath: "AffiliateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? Cookies.get("token") : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Affiliate"],
  endpoints: (builder) => ({
    createAffiliateRequest: builder.mutation({
      query: (data) => ({
        url: "/affiliate/request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    updateAffiliateRequest: builder.mutation({
      query: ({ id, body }) => ({
        url: `/affiliate/request/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    approveAffiliateRequest: builder.mutation({
      query: ({ id, body }) => ({
        url: `/affiliate/approve/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    getManyAffiliate: builder.query({
      query: (params) => ({
        url: "/affiliate/many",
        params,
      }),
      providesTags: ["Affiliate"],
    }),
    getMyAffiliate: builder.query({
      query: () => ({
        url: "/affiliate/me",
      }),
      providesTags: ["Affiliate"],
    }),
    getAffiliateAdminSummary: builder.query({
      query: () => ({
        url: "/affiliate/summary/admin",
      }),
      providesTags: ["Affiliate"],
    }),
  }),
});

export const {
  useCreateAffiliateRequestMutation,
  useUpdateAffiliateRequestMutation,
  useApproveAffiliateRequestMutation,
  useGetManyAffiliateQuery,
  useGetMyAffiliateQuery,
  useGetAffiliateAdminSummaryQuery,
} = AffiliateApi;
