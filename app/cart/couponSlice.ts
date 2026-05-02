import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    appliedCoupon: null,
    discount: 0,
    finalAmount: 0,
    couponCode: "",
};

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        applyCoupon: (state, action) => {
            state.appliedCoupon = action.payload;
            state.discount = action.payload.discount || 0;
            state.finalAmount = action.payload.finalAmount || 0;
            state.couponCode = action.payload.code || "";
        },
        removeCoupon: (state) => {
            state.appliedCoupon = null;
            state.discount = 0;
            state.finalAmount = 0;
            state.couponCode = "";
        },
    },
});

export const { applyCoupon, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;