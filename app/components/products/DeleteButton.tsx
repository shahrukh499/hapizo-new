"use client";
import { IconButton } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../snackbar/snackbarSlice"; // if you still want snackbar from Redux
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

type DeleteButtonProps = {
  id: string;
};

function DeleteButton({ id }: DeleteButtonProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const deleteCartItem = async (cartId: string) => {
    const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.ADDTOCART}/${cartId}`);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.DELETE
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (data.status !== API_CONFIG.STATUS_CODES.SUCCESS) {
      throw new Error(data.message || "Failed to delete item");
    }

    return data;
  };

  const mutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: (data, deletedCartItemId) => {
      // ✅ show success message
      dispatch(showSnackbar({ message: data.message, variant: "success" }));

      // ✅ optimistic-like cache sync so UI updates immediately
      queryClient.setQueriesData({ queryKey: ["cartItems"] }, (oldData: any) => {
        if (!oldData?.cart?.items) return oldData;

        const updatedItems = oldData.cart.items.filter(
          (item: any) => item?._id !== deletedCartItemId
        );

        return {
          ...oldData,
          cart: {
            ...oldData.cart,
            items: updatedItems,
          },
        };
      });

      // ✅ keep server and client cache in sync
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    },
  });

  return (
    <IconButton
      onClick={() => mutation.mutate(id)}
      sx={{ p: "3px", display: "flex", justifyContent: "end", backgroundColor:'#f3e8ff', color:'#8200db' }}
      disabled={mutation.isPending}
    >
      <DeleteOutlineOutlinedIcon fontSize="small" />
    </IconButton>
  );
}

export default DeleteButton;
