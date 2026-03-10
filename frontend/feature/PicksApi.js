import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PicksApi = createApi({
  reducerPath: "PicksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Picks"],
  endpoints: (builder) => ({
    createPicks: builder.mutation({
      query: (data) => ({
        url: "/picks",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Picks"],
    }),
    updatePicks: builder.mutation({
      query: ({ id, data }) => ({
        url: `/picks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Picks"],
    }),
    deletePicks: builder.mutation({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Picks"],
    }),
    deleteManyPicks: builder.mutation({
      query: (data) => ({
        url: "/picks/delete-many",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Picks"],
    }),
    getManyPicks: builder.query({
      query: (params) => ({
        url: "/picks",
        params,
      }),
      providesTags: ["Picks"],
    }),
    getPicksById: builder.query({
      query: (id) => `/picks/${id}`,
      providesTags: ["Picks"],
    }),
  }),
});

export const {
  useCreatePicksMutation,
  useUpdatePicksMutation,
  useDeletePicksMutation,
  useDeleteManyPicksMutation,
  useGetManyPicksQuery,
  useGetPicksByIdQuery,
} = PicksApi;