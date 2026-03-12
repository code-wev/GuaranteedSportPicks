import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const PicksApi = createApi({
  reducerPath: "PicksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = getCookie("token");

      if (token) headers.set("authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (builder) => ({
    createPicks: builder.mutation({
      query: (data) => ({
        url: "/picks",
        method: "POST",
        body: data,
      }),
    }),

    getManyPicks: builder.query({
      query: (params) => ({
        url: "/picks/get-picks/many",
        method: "GET",
        params,
      }),
    }),

    getPicksById: builder.query({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "GET",
      }),
    }),

    updatePicks: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/picks/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deletePicks: builder.mutation({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "DELETE",
      }),
    }),

    deleteManyPicks: builder.mutation({
      query: (body) => ({
        url: "/picks/delete-picks/many",
        method: "DELETE",
        body,
      }),
    }),
  }),
});

export const {
  useCreatePicksMutation,
  useGetManyPicksQuery,
  useGetPicksByIdQuery,
  useUpdatePicksMutation,
  useDeletePicksMutation,
  useDeleteManyPicksMutation,
} = PicksApi;
