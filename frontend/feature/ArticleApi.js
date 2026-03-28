import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export const ArticleApi = createApi({
  reducerPath: "ArticleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: base_url,
    credentials: "include",
    prepareHeaders: (headers, { body }) => {
      const token = getCookie("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      // If the body is FormData, we should NOT set Content-Type manually.
      // fetch will automatically set it with the correct boundary.
      if (body instanceof FormData) {
        // We don't need to do anything, just ensure we DON'T set it to application/json
      } else {
        headers.set("Accept", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Article"],
  endpoints: (builder) => ({
    createArticle: builder.mutation({
      query: (data) => ({
        url: "/article",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Article"],
    }),

    getAllArticles: builder.query({
      query: (params) => ({
        url: "/article",
        method: "GET",
        params,
      }),
      providesTags: ["Article"],
    }),

    getArticleBySlug: builder.query({
      query: (slug) => ({
        url: `/article/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "Article", id: slug }],
    }),

    getArticleById: builder.query({
      query: (id) => ({
        url: `/article/get-article-by-id/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Article", id }],
    }),

    updateArticle: builder.mutation({
      query: ({ id, data }) => ({
        url: `/article/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Article"],
    }),

    deleteArticle: builder.mutation({
      query: (id) => ({
        url: `/article/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Article"],
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useGetAllArticlesQuery,
  useGetArticleBySlugQuery,
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = ArticleApi;
