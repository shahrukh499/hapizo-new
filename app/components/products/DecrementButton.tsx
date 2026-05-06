import { IconButton } from '@mui/material'
import React from 'react'
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSnackbar } from '../snackbar/snackbarSlice';

type DecrementButtonProps = {
    productSize: string;
    productId: string;
    productColor: string;
    currentQty: number;
    cartItemId?: string;
}

function DecrementButton({ productSize, productId, productColor, currentQty, cartItemId }: DecrementButtonProps) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const handleDecrementApi = async ({ id }: { id: string }) => {
    try {
      const payload = {
        productId: id,
        productSize: productSize,
        productColor: productColor
      }
      const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.DECREMENTCARTITEM}`);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload as any
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
      if (data.status !== API_CONFIG.STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Failed to increase quantity");
      }
      return data
    } catch (e) {
      throw e
    }
  }

  const mutation = useMutation({
    mutationFn: handleDecrementApi,
    onSuccess: (data, variables) => {
      dispatch(showSnackbar({ message: data.message, variant: "success" }));

      queryClient.setQueriesData({ queryKey: ["cartItems"] }, (oldData : any) => {
        if (!oldData?.cart?.items) return oldData;

        const updatedItems = oldData.cart.items
          .map((item : any) => {
            const isSameItem =
              (cartItemId && item?._id === cartItemId) ||
              (
                item?._id === variables?.id &&
                item?.productSize === productSize &&
                item?.productColor === productColor
              );

            if (!isSameItem) return item;

            const nextQty = (item?.quantity ?? currentQty ?? 1) - 1;
            if (nextQty <= 0) return null;

            return {
              ...item,
              quantity: nextQty,
            };
          })
          .filter(Boolean);

        return {
          ...oldData,
          cart: {
            ...oldData.cart,
            items: updatedItems,
          },
        };
      });

      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    }
  })

  return (
    <IconButton onClick={() => mutation.mutate({ id: productId })}>
      <RemoveIcon sx={{ color: "#9c27b0" }} fontSize="small" />
    </IconButton>
  )
}

export default DecrementButton