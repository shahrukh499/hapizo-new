"use client";
import React, { useState, useEffect } from 'react'
import { Checkbox, Box } from '@mui/material'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig'
import { showSnackbar } from '../snackbar/snackbarSlice'
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

function WishlistButton({ productId } : { productId: string}) {
    const [isFavorite, setIsFavorite] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.authSlice);
    const queryClient = useQueryClient();

    // Fetch wishlist items
    const fetchWishlist = async () => {
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.GET
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        // Check if response has wishlist array (success case)
        if (data.wishlist && Array.isArray(data.wishlist)) {
            return data;
        }
        
        // Check for status code if present
        if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
            return data;
        }
        
        // If neither condition is met, throw error
        throw new Error(data.message || 'Failed to fetch wishlist');
    };

    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: fetchWishlist,
        enabled: !!user && !!productId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false, // Don't retry on error
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    });

    // Check if product is in wishlist and update state
    useEffect(() => {
        if (!productId) {
            setIsFavorite(false);
            return;
        }

        if (wishlistData?.wishlist && Array.isArray(wishlistData.wishlist)) {
            const isInWishlist = wishlistData.wishlist.some(
                (item : { _id: string; productId: string }) => item._id === productId || item.productId === productId
            );
            setIsFavorite(isInWishlist);
        } else if (wishlistData === undefined) {
            // Data is still loading, don't change state
            return;
        } else {
            // No wishlist data or empty, set to false
            setIsFavorite(false);
        }
    }, [wishlistData, productId]);

    const addToWishlist = async (productId: string) => {
        const payload = {
            productId
        };

        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any
        );

        const response = await fetch(apiUri, requestOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to add to wishlist');
        }
        
        const data = await response.json();

        // Check if response has message (success case) or status code
        if (data.message || data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
            return data;
        }

        throw new Error(data.message || 'Failed to add to wishlist');
    };

    const mutation = useMutation({
        mutationFn: addToWishlist,
        onSuccess: (data: any) => {
            setIsFavorite(true);
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            dispatch(showSnackbar({ message: data.message || 'Added to wishlist', variant: 'success' }));
        },
        onError: (error: any) => {
            dispatch(showSnackbar({ message: error.message || 'Failed to add to wishlist', variant: 'error' }));
        },
    });

    const toggleFavorite = () => {
        if (!user) {
            dispatch(showSnackbar({ message: 'You must Log In first', variant: 'warning' }));
            return;
        }

        if (!productId) {
            dispatch(showSnackbar({ message: 'Product ID is required', variant: 'error' }));
            return;
        }

        mutation.mutate(productId);
    };

    return (
        <Box
            sx={{
                display: 'inline-flex',
                borderRadius: '4px',
                backgroundColor: '#313647',
                padding: '9px',
            }}
        >
            <Checkbox
                sx={{
                    color: '#ffffff',
                    padding: '0',
                    '&.Mui-checked': {
                        color: '#ffffff',
                    },
                }}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                checked={isFavorite}
                onChange={toggleFavorite}
                disabled={mutation.isPending}
            />
        </Box>
    )
}

export default WishlistButton