import { UserApi } from "@/feature/UserApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer:{
        [UserApi.reducer]:UserApi.reducer

    },

     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
        UserApi.middleware
     
      
    ]),
})