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
    createAffiliate: builder.mutation({
      query: (data) => ({
        url: "/affiliate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    updateAffiliate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/affiliate/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    deleteAffiliate: builder.mutation({
      query: (id) => ({
        url: `/affiliate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Affiliate"],
    }),
    deleteManyAffiliate: builder.mutation({
      query: (data) => ({
        url: "/affiliate/delete-many",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Affiliate"],
    }),
    getManyAffiliate: builder.query({
      query: (params) => ({
        url: "/affiliate",
        params,
      }),
      providesTags: ["Affiliate"],
    }),
    getAffiliateById: builder.query({
      query: (id) => `/affiliate/${id}`,
      providesTags: ["Affiliate"],
    }),
  }),
});

export const {
  useCreateAffiliateMutation,
  useUpdateAffiliateMutation,
  useDeleteAffiliateMutation,
  useDeleteManyAffiliateMutation,
  useGetManyAffiliateQuery,
  useGetAffiliateByIdQuery,
} = AffiliateApi;
