import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSignupOpen: false,
    isLoginOpen: false,
    isForgotPass: false
}

const popupSlice = createSlice({
    name: "menuBar",
    initialState,
    reducers: {
        handleOpenSignupModal: (state, action) => {
            state.isSignupOpen = action.payload;
        },
        handleOpenLoginModal: (state, action) => {
            state.isLoginOpen = action.payload;
        },
        handleOpenForgotPass: (state, action) => {
            state.isForgotPass = action.payload;
        }

    }
})  

export const { handleOpenSignupModal, handleOpenLoginModal, handleOpenForgotPass } = popupSlice.actions;
export default popupSlice.reducer;