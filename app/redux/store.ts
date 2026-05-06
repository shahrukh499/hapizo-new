import { configureStore } from "@reduxjs/toolkit";
import popupSlice from "@/app/components/header/popupSlice";
import authSlice from "@/app/components/header/authSile";
import snackbarSlice from "@/app/components/snackbar/snackbarSlice"
import addressSlice from "@/app/components/address/addressSlice";
import loginsignupSlice from "@/app/components/auth/loginsignupSlice"
import couponSlice from "@/app/cart/couponSlice"

export const store = configureStore({
    reducer: {
        popupSlice,
        authSlice,
        snackbarSlice,
        addressSlice,
        loginsignupSlice,
        couponSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;