import { createSlice } from "@reduxjs/toolkit";

const savedAddressId = typeof window !== 'undefined' ? localStorage.getItem('selectedAddressId') : null;

const initialState = {
    isAddressModalOpen: false,
    isEditAddress: false,
    selectedAddressId: savedAddressId || null, // Changed from setAddressIdForOrder to selectedAddressId
}

const addressSlice = createSlice({
    name: "address",
    initialState,
    reducers: {
        handleAddressModal: (state, action) => {
            state.isAddressModalOpen = action.payload;
        },
        handleEditAddressModal: (state, action) => {
            state.isEditAddress = action.payload
        },
        handleGetAddressId: (state, action) => {
            state.selectedAddressId = action.payload;

            // ✅ Save it in localStorage so it stays even after reload
            if (typeof window !== 'undefined') {
                localStorage.setItem('selectedAddressId', action.payload);
            }
        },
        clearAddressId: (state) => {
            state.selectedAddressId = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('selectedAddressId');
            }
        },
    }
})

export const { handleAddressModal, handleEditAddressModal, handleGetAddressId, clearAddressId } = addressSlice.actions;
export default addressSlice.reducer;