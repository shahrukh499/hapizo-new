import React from 'react'
import { Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showSnackbar } from '../snackbar/snackbarSlice';
import { useDispatch } from 'react-redux';

function DeleteAddress({addrid} : {addrid : string}) {
    const dispatch = useDispatch()
    const queryClient = useQueryClient();

    const handleDeleteAddress = async (id : any) => {
        const apiUri = `${getApiUrl(API_CONFIG.ENDPOINTS.ADDRESS)}?addressId=${id}`;
        const requestOptions = API_CONFIG.createRequestOptions(
          API_CONFIG.HTTP_METHODS.DELETE
        );
      
        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();
      
        if (!response.ok) {
          throw new Error(data.message || "Failed to delete address");
        }
        return data;
      };

    const mutation = useMutation({
        mutationFn: handleDeleteAddress,
        onSuccess: (data) => {
          dispatch(showSnackbar({ message: data.message, variant: "success" }));
          queryClient.invalidateQueries({ queryKey: ["addresses"] });
          queryClient.refetchQueries({ queryKey: ["addresses"] });
        },
        onError: (error) => {
          dispatch(showSnackbar({ message: error.message, variant: "error" }));
        },
      });
  return (
    <Button 
      onClick={()=>mutation.mutate(addrid)} 
      variant="contained" 
      startIcon={<DeleteIcon 
      fontSize='small' />}
      sx={{
        color: '#ffffff',
        backgroundColor: '#313647',
        border: '0',
        display: 'flex',
        alignItems: 'start',
        gap: '5px',
        padding: '5px 20px',
        textTransform: 'capitalize',
        marginTop: '5px',
        fontSize: '14px'
    }}
      >
        Delete
    </Button>
  )
}

export default DeleteAddress