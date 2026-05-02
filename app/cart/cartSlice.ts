import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_CONFIG, getApiUrl } from "../utils/apiConfig";

export const handleGetCartItems = createAsyncThunk(
  "getCartItem",
  async (_, thunkAPI) => {
    try {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDTOCART); // Should point to GET /cart
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.GET
      );

      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        return data || []; // ✅ return cart data
      } else {
        return thunkAPI.rejectWithValue(data.message || "Failed to fetch cart");
      }
    } catch (error : any) {
      return thunkAPI.rejectWithValue(error.message || "Unknown error");
    }
  }
);

const initialState = {
  cart: [],
  message: "",
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    cartItemsAdd: (state, action) => {
      state.cart = action.payload.cart; // Make sure this is an array of items
      state.message = action.payload.message;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGetCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(handleGetCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { cartItemsAdd } = cartSlice.actions;
export default cartSlice.reducer;
