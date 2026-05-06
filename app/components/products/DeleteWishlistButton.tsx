"use client";
import { IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../snackbar/snackbarSlice";

function DeleteWishlistButton({ wishlistItemId } : {wishlistItemId : string}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteWishlistItem = async (id: string) => {
    // Try query parameter approach first (like DeleteAddress)
    const apiUri = `${getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST)}?productId=${id}`;
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.DELETE
    );

    const response = await fetch(apiUri, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete wishlist item");
    }
    
    const data = await response.json();

    // Check if response has message (success case) or status code
    if (data.message || data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
      return data;
    }

    throw new Error(data.message || "Failed to delete wishlist item");
  };

  const mutation = useMutation({
    mutationFn: deleteWishlistItem,
    onSuccess: (data: any) => {
      dispatch(showSnackbar({ message: data.message, variant: "success" }));
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error: any) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    },
  });

  return (
    <IconButton
      onClick={() => mutation.mutate(wishlistItemId)}
      sx={{ p: "3px", display: "flex", justifyContent: "end", color: '#000000', backgroundColor: '#eef2ff', borderRadius: '50%' }}
      disabled={mutation.isPending}
    >
      <CloseIcon fontSize="small" sx={{ color: '#000000' }} />
    </IconButton>
  );
}

export default DeleteWishlistButton;

