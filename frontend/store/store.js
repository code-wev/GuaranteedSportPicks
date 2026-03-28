import { AffiliateApi } from "@/feature/AffiliateApi";
import { ArticleApi } from "@/feature/ArticleApi";
import { AuthApi } from "@/feature/AuthApi";
import { NewslatterApi } from "@/feature/NewslatterApi";
import { PaymentApi } from "@/feature/PaymentApi";
import { PicksApi } from "@/feature/PicksApi";
import { TestimonialApi } from "@/feature/TestimonialApi";
import { UserApi } from "@/feature/UserApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [PaymentApi.reducerPath]: PaymentApi.reducer,
    [PicksApi.reducerPath]: PicksApi.reducer,
    [NewslatterApi.reducerPath]: NewslatterApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [AffiliateApi.reducerPath]: AffiliateApi.reducer,
    [ArticleApi.reducerPath]: ArticleApi.reducer,
    [TestimonialApi.reducerPath]: TestimonialApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      PaymentApi.middleware,
      PicksApi.middleware,
      NewslatterApi.middleware,
      AuthApi.middleware,
      AffiliateApi.middleware,
      ArticleApi.middleware,
      TestimonialApi.middleware,
    ]),
});
