import React, {memo} from 'react'
import { API_CONFIG, getApiUrl } from '../utils/apiConfig';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Skeleton } from '@mui/material';

function Showcase1() {
    const { data: showcase1, isLoading, error } = useQuery({
        queryKey: ["showcase1"],
        queryFn: async () => {
            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.SHOWCASE1);
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

    if (isLoading) {
        return (
            <section>
                <div className="container mx-auto px-2">
                    <div className="flex flex-wrap justify-center gap-y-4">
                        <div className="w-full md:w-[35%] 2xl:w-[35%] px-1.5">
                            <Skeleton variant="rectangular" animation="wave" width={`100%`} height={`100%`} />
                        </div>
                        <div className="w-full md:w-[65%] 2xl:w-[65%] px-1.5">
                            <div className="flex gap-x-3 mb-3">
                                <div className='w-full'>
                                    <Skeleton variant="rectangular" animation="wave" width={`100%`} height={200} />
                                </div>
                                <div className='w-full'>
                                    <Skeleton variant="rectangular" animation="wave" width={`100%`} height={200} />
                                </div>
                            </div>
                            <div className='w-full'>
                                <Skeleton variant="rectangular" animation="wave" width={`100%`} height={250} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section>
            <div className="container mx-auto px-2">
                <div className="flex flex-wrap justify-center gap-y-4">
                    <div className="w-full md:w-[35%] 2xl:w-[35%] px-1.5">
                        {showcase1?.showcase1 && showcase1.showcase1[0] && (
                            <Link href={showcase1.showcase1[0].link || ""}>
                                <Image
                                    loading="eager"
                                    src={showcase1.showcase1[0].imageUrl || "/assets/img/1000X1000.webp"}
                                    alt="Image 1"
                                    width={1000}
                                    height={1000}
                                />
                            </Link>
                        )}
                    </div>
                    <div className="w-full md:w-[65%] 2xl:w-[65%] px-1.5">
                        <div className="flex gap-x-3 mb-3">
                            <div>
                                {showcase1?.showcase1 && showcase1.showcase1[1] ? (
                                    <Link href={showcase1.showcase1[1].link}>
                                        <Image
                                            loading="eager"
                                            src={showcase1.showcase1[1].imageUrl}
                                            alt="Image 1"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                ) : (
                                    // ✅ Fallback block when item[1] is missing
                                    <Link href="">
                                        <Image
                                            loading="eager"
                                            src="/assets/img/coming-soon-800X400.webp"
                                            alt="Fallback Image"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                )}
                            </div>
                            <div>
                                {showcase1?.showcase1 && showcase1.showcase1[2] ? (
                                    <Link href={showcase1.showcase1[2].link}>
                                        <Image
                                            loading="eager"
                                            src={showcase1.showcase1[2].imageUrl}
                                            alt="Image 1"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                ) : (
                                    // ✅ Fallback block when item[1] is missing
                                    <Link href="/shirt?category=tshirt">
                                        <Image
                                            loading="eager"
                                            src="/assets/img/coming-soon-800X400.webp"
                                            alt="Fallback Image"
                                            width={800}
                                            height={400}
                                        />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div>
                            {showcase1?.showcase1 && showcase1.showcase1[3] ? (
                                <Link href={showcase1.showcase1[3].link}>
                                    <Image
                                        loading="eager"
                                        src={showcase1.showcase1[3].imageUrl}
                                        alt="Image 1"
                                        width={1200}
                                        height={330}
                                    />
                                </Link>
                            ) : (
                                // ✅ Fallback block when item[1] is missing
                                <Link href="/">
                                    <Image
                                        loading="eager"
                                        src="/assets/img/coming-soon-1200X330.webp"
                                        alt="Fallback Image"
                                        width={1200}
                                        height={330}
                                    />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default memo(Showcase1) 