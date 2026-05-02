import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  user: any | null;
  loading: boolean
};

const initialState : AuthState = {
    user:null,
    /* userData:null, */
    loading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser:(state, action)=>{
            state.user = action.payload;
            state.loading = false;
        },
        setLocalStorageData:(state, action)=>{
            /* state.userData = action.payload; */
            localStorage.setItem("logData",JSON.stringify(action.payload));
        },
        setAuthLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
})  

export const { setUser, setLocalStorageData, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;