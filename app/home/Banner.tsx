import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import { API_CONFIG, getApiUrl } from '../utils/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@mui/material';

const Banner = () => {

    const { data: banner, isLoading, error } = useQuery({
        queryKey: ["Banner"],
        queryFn: async () => {
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.BANNER);
            const requestOptions = API_CONFIG.createRequestOptions(
                API_CONFIG.HTTP_METHODS.GET
            );

            const response = await fetch(apiUri, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch products");
            }

            return data;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        refetchOnWindowFocus: false,
    });

    if (error) {
        return (
            <div className='flex justify-center flex-col bg-[#f1eded] h-[400px]'>
                <p className=' text-center '>Something went wrong: {error.message || error.toString()}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <Skeleton variant="rectangular" animation="wave" width={`100%`} height={500} />
        )
    }

    return (
        <div>
            <Splide
                options={{
                    rewind: true,
                    gap: '1rem',
                    arrows: false,
                    pagination: true,
                }}
            >
                {
                    banner?.banners.length > 0 ? (
                        banner?.banners.map((ele: any, i: number) => {
                            return (
                                <SplideSlide key={i} className={ele.isActive ? `block` : 'hidden'}>
                                    <Link href={ele.link}>
                                        <picture>
                                            <source media="(max-width: 768px)" srcSet={ele.mobileImageUrl} />
                                            <Image
                                                loading="eager"
                                                src={ele.imageUrl}
                                                alt="banner"
                                                className="m-auto w-full h-auto"
                                                width={1900}
                                                height={600}
                                            />
                                        </picture>
                                    </Link>
                                </SplideSlide>
                            )
                        })

                    ) : (
                        <p>Empty Banner</p>
                    )
                }
            </Splide>
        </div>
    )
}

export default Banner