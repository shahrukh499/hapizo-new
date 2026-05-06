"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { API_CONFIG, getApiUrl } from '../utils/apiConfig';
import { showSnackbar } from './snackbar/snackbarSlice';
import { useDispatch } from 'react-redux';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { IconButton } from '@mui/material';

type LikeDislikeReviewsProps = {
    reviewId: string;
    like: string | number;
    dislike: string | number;
}

function LikeDisLikeReviews({reviewId, like, dislike} :  LikeDislikeReviewsProps) {

  const dispatch = useDispatch()
  const queryClient = useQueryClient();

  const handleReviewLike = async (id: string) => {
    const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.REVIEWLIKE}/${id}/helpful`);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.POST
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  };

  const handleReviewDislike = async (id : string) => {
    const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.REVIEWLIKE}/${id}/dislike`);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.POST
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  };

  const mutationLike = useMutation({
    mutationFn: handleReviewLike,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviewKey"] });
      dispatch(showSnackbar({
        message: data?.message || "Helpfull Review",
        variant: "success"
      }));
    },
    onError: (error) => {
      dispatch(showSnackbar({
        message: error?.message || "Failed to submit review",
        variant: "error"
      }));
    }
  })

  const mutationDislike = useMutation({
    mutationFn: handleReviewDislike,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviewKey"] });
      dispatch(showSnackbar({
        message: data?.message || "Marked as not helpful",
        variant: "success"
      }));
    },
    onError: (error) => {
      dispatch(showSnackbar({
        message: error?.message || "Failed to submit review",
        variant: "error"
      }));
    }
  })
  return (
    <div>
      <p className='font-semibold'>Was this helpful?</p>
      <div className='flex items-center gap-x-3'>
        <div className='flex items-center'>
          <IconButton onClick={() => mutationLike.mutate(reviewId)}>
            <ThumbUpOutlinedIcon />
          </IconButton>
          <span className='text-[16px]'>{like || 0}</span>
        </div>
        <div className='flex items-center'>
          <IconButton onClick={() => mutationDislike.mutate(reviewId)}>
            <ThumbDownOffAltIcon />
          </IconButton>
          <span className='text-[16px]'>{dislike || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default LikeDisLikeReviews