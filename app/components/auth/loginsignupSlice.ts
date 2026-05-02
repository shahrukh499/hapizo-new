import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOtpModal: false,
    isSignUpLoginModal: false,
    userNumber:'',
    isUserDetailsModal: false
}

const loginsignupSlice = createSlice({
    name: 'loginsignup',
    initialState,
    reducers: {
        handleSignUpLoginModal: (state, action) =>{
            state.isSignUpLoginModal = action.payload
        },
        handleOtpModal: (state, action) =>{
            state.isOtpModal = action.payload
        },
        handleGetNumber: (state, action)=>{
            state.userNumber = action.payload
        },
        handleUserDetails: (state, action)=>{
            state.isUserDetailsModal = action.payload
        }
    }
})

export const {handleOtpModal, handleGetNumber, handleUserDetails, handleSignUpLoginModal} = loginsignupSlice.actions;
export default loginsignupSlice.reducer; 