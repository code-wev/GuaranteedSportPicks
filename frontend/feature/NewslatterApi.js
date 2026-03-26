import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie';

// Cookie থেকে token নেওয়ার ফাংশন
const getToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get("token") || null;
};

export const NewslatterApi = createApi({
  reducerPath: "NewslatterApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      // Token cookie 
      const token = getToken();
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      
      // Content-Type set 
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      
      return headers;
    },
    credentials: "include", // cookies 
  }),
  tagTypes: ["Newslatter"],
  endpoints: (builder) => ({
    createNewslatter: builder.mutation({
      query: (data) => ({
        url: "/newslatter",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newslatter"],
    }),
    updateNewslatter: builder.mutation({
      query: ({ id, data }) => ({
        url: `/newslatter/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Newslatter"],
    }),
    getManyNewslatter: builder.query({
      query: (params) => ({
        url: "/newslatter/get-newslatter/many",
        params,
      }),
      providesTags: ["Newslatter"],
    }),
    getNewslatterById: builder.query({
      query: (id) => `/newslatter/${id}`,
      providesTags: ["Newslatter"],
    }),
    // User এর newsletter status 
    getUserNewsletterStatus: builder.query({
      query: (userId) => `/newslatter/me`,
      providesTags: ["Newslatter"],
    }),

    toggleNewsletter: builder.mutation({
      query: (data) => ({
        url: `/newslatter/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newslatter"],
    }),
  }),
});

export const {
  useCreateNewslatterMutation,
  useUpdateNewslatterMutation,
  useGetManyNewslatterQuery,
  useGetNewslatterByIdQuery,
  useGetUserNewsletterStatusQuery,
  useToggleNewsletterMutation,
  
} = NewslatterApi;