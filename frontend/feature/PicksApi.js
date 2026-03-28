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

    getManyPicks: builder.query({
      query: (params) => ({
        url: "/picks/get-picks/many",
        method: "GET",
        params,
      }),
      providesTags: ["Picks"],
    }),

    getAdminPicks: builder.query({
      query: (params) => ({
        url: "/picks/admin/all",
        method: "GET",
        params,
      }),
      providesTags: ["Picks"],
    }),

    getPicksById: builder.query({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Picks", id }],
    }),

    getMyAccessiblePicks: builder.query({
      query: () => ({
        url: "/picks/my-access",
        method: "GET",
      }),
      providesTags: ["Picks"],
    }),

    updatePicks: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/picks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Picks",
        { type: "Picks", id },
      ],
    }),

    deletePicks: builder.mutation({
      query: (id) => ({
        url: `/picks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Picks"],
    }),

    deleteManyPicks: builder.mutation({
      query: (body) => ({
        url: "/picks/delete-picks/many",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Picks"],
    }),
  }),
});

export const {
  useCreatePicksMutation,
  useGetManyPicksQuery,
  useGetAdminPicksQuery,
  useGetPicksByIdQuery,
  useGetMyAccessiblePicksQuery,
  useUpdatePicksMutation,
  useDeletePicksMutation,
  useDeleteManyPicksMutation,
} = PicksApi;
