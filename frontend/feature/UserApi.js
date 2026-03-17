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
      query: () => "/user/getAllUser",
      providesTags: ["Users"],
    }),
    getSingleUser: builder.query({
      query: (id) => `/user/single/${id}`,
    }),
    myProfile: builder.query({
      query: (id) => `/user/profile/me`,
    }),
    updateUser: builder.mutation({
      query: ({ email, body }) => ({
        url: `/user/updateProfile`,
        method: "PUT",
        body: { email, ...body },
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/deleteUser/${id}`,
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
  useDeleteUserMutation,
  useMyProfileQuery
} = UserApi;
