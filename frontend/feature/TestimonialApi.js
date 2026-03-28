import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const TestimonialApi = createApi({
  reducerPath: "TestimonialApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? Cookies.get("token") : null;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Testimonials"],
  endpoints: (builder) => ({
    createTestimonial: builder.mutation({
      query: (body) => ({
        url: "/testimonial",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Testimonials"],
    }),
    getMyTestimonials: builder.query({
      query: () => "/testimonial/my",
      providesTags: ["Testimonials"],
    }),
    getApprovedTestimonials: builder.query({
      query: () => "/testimonial",
      providesTags: ["Testimonials"],
    }),
    getAdminTestimonials: builder.query({
      query: (params) => ({
        url: "/testimonial/admin/all",
        params,
      }),
      providesTags: ["Testimonials"],
    }),
    updateTestimonialStatus: builder.mutation({
      query: ({ id, body }) => ({
        url: `/testimonial/admin/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Testimonials"],
    }),
  }),
});

export const {
  useCreateTestimonialMutation,
  useGetMyTestimonialsQuery,
  useGetApprovedTestimonialsQuery,
  useGetAdminTestimonialsQuery,
  useUpdateTestimonialStatusMutation,
} = TestimonialApi;
