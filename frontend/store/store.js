import { AffiliateApi } from "@/feature/AffiliateApi";
import { AuthApi } from "@/feature/AuthApi";
import { NewslatterApi } from "@/feature/NewslatterApi";
import { PaymentApi } from "@/feature/PaymentApi";
import { PicksApi } from "@/feature/PicksApi";
import { UserApi } from "@/feature/UserApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        [UserApi.reducerPath]:UserApi.reducer,
        [PaymentApi.reducerPath]: PaymentApi.reducer,
        [AuthApi.reducerPath]: AuthApi.reducer,
        [PicksApi.reducerPath]: PicksApi.reducer,
        [AffiliateApi.reducerPath]: AffiliateApi.reducer,
        [NewslatterApi.reducerPath]: NewslatterApi.reducer,

    },

     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        UserApi.middleware,
        PaymentApi.middleware,
        AuthApi.middleware,
        PicksApi.middleware,
        AffiliateApi.middleware,
        NewslatterApi.middleware,
     
      
    ]),
})