import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const NewslatterApi = createApi({
  reducerPath: "NewslatterApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
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
  }),
});

export const {
  useCreateNewslatterMutation,
  useUpdateNewslatterMutation,
  useGetManyNewslatterQuery,
  useGetNewslatterByIdQuery,
} = NewslatterApi;