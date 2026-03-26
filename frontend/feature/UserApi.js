import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: base_url,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? Cookies.get('token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (params) => ({
        url: "/user/many",
        params,
      }),
      providesTags: ["Users"],
    }),
    getSingleUser: builder.query({
      query: (id) => `/user/get-user/${id}`,
    }),
    myProfile: builder.query({
      query: () => `/user/profile/me`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: `/user`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUserById: builder.mutation({
      query: ({ id, body }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useGetAllUserQuery,
  useUpdateUserMutation,
  useUpdateUserByIdMutation,
  useDeleteUserMutation,
  useMyProfileQuery
} = UserApi;
