import { PaymentApi } from "@/feature/PaymentApi";
import { PicksApi } from "@/feature/PicksApi";
import { UserApi } from "@/feature/UserApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [UserApi.reducerPath]: UserApi.reducer,
    [PaymentApi.reducerPath]: PaymentApi.reducer,
    [PicksApi.reducerPath]: PicksApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      UserApi.middleware,
      PaymentApi.middleware,
      PicksApi.middleware,
    ]),
});
