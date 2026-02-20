import { base_url } from "@/utils/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const PaymentApi = createApi({
  reducerPath: "PaymentApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),

  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => ({
        url: '/payment/create-subscripiton',
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateSubscriptionMutation } = PaymentApi;
