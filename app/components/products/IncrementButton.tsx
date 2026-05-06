import React from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSnackbar } from '../snackbar/snackbarSlice';

type IncrementButtonProps = {
  productId: string;
  productSize: string;
  productColor: string;
};

function IncrementButton({ productId, productSize, productColor }: IncrementButtonProps) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const handleIncrementApi = async (id: string) => {
    try {
      const payload = {
        productId: id,
        productSize: productSize,
        productColor: productColor
      }
      const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.INCREMENTCARTITEM}`);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload as any
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();
      if (data.status !== API_CONFIG.STATUS_CODES.SUCCESS) {
        throw new Error(data.message || "Failed to increase quantity");
      }
      return data;
    } catch (e) {
      throw e;
    }
  }

  const mutation = useMutation({
    mutationFn: handleIncrementApi,
    onSuccess: (data) => {
      dispatch(showSnackbar({ message: data.message, variant: "success" }));
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
    onError: (error) => {
      dispatch(showSnackbar({ message: error.message, variant: "error" }));
    },
  });

  return (
    <IconButton onClick={() => mutation.mutate(productId)}>
      <AddIcon sx={{ color: "#9c27b0" }} fontSize="small" />
    </IconButton>
  )
}

export default IncrementButton
