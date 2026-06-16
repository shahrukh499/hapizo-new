import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpenSearchModal : false
}

const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers:{
        handleOpenSearchModal : (state, action) =>{
            state.isOpenSearchModal = action.payload;
        },
        handleCloseSearchModal : (state, action) => {
            state.isOpenSearchModal = action.payload
        }
    }
});

export const { handleOpenSearchModal, handleCloseSearchModal } = searchSlice.actions;
export default searchSlice.reducer;