import { API_CONFIG, getApiUrl } from '@/app/utils/apiConfig';
import { Button, Skeleton } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react'
import Review from './Revew';
import UpdateReview from './UpdateReview';
import { useAppDispatch } from '@/app/redux/hooks';
import { showSnackbar } from '../snackbar/snackbarSlice';
import SideNavbarMobile from './SideNavbarMobile';

export default function UserOrderDetails() {
    const [selectedItems, setSelectedItems] = useState<{ [orderId: string]: string[] }>({});
    const dispatch = useAppDispatch();

    //console.log(selectedItems, "ss")

    const handleUserOrders = async () => {
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ORDERLIST);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.GET
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    };

    const { data: orders, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: handleUserOrders,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });

    //console.log(orders,'order');

    const handleMultiCancel = async (id: any) => {
        const payload = {
            orderId: id,
            itemIds: selectedItems,
        }
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.CANCELORDER);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    };

    const mutation = useMutation({
        mutationFn: handleMultiCancel,
        onSuccess: (data) => {
            dispatch(showSnackbar({ message: data.message || "Order Cancel Successfully", variant: "success" }));
        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }));
        },
    })



    return (
        <div>
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-[25px] font-semibold">All Orders</h1>
                <div className="lg:hidden">
                    <SideNavbarMobile />
                </div>
            </div>
            <div>
                {
                    isLoading ? (
                        <Skeleton sx={{ mb: 2, borderRadius: 3 }} variant="rectangular" animation="wave" width={`100%`} height={200} />
                    ) : (
                        orders?.orders?.length > 0 ? (
                            orders?.orders?.map((ord: any, i: number) => {
                                return (
                                    <div key={i} className='bg-gray-200 my-3 rounded p-3'>
                                        <div>
                                            {
                                                ord.status === "confirmed" ? (
                                                    <div className='flex items-center gap-x-2'>
                                                        <Image src="/assets/img/confirmed.png" alt='' width={45} height={45} />
                                                        <div>
                                                            <p className='capitalize font-semibold text-[18px] text-[#05d134] leading-tight'>confirmed</p>
                                                            <p className='text-[14px]'>
                                                                Arrived By{" "}
                                                                {new Date(
                                                                    new Date(ord.createdAt).setDate(
                                                                        new Date(ord.createdAt).getDate() + 5
                                                                    )
                                                                ).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                })}
                                                                {" - "}
                                                                {new Date(
                                                                    new Date(ord.createdAt).setDate(
                                                                        new Date(ord.createdAt).getDate() + 9
                                                                    )
                                                                ).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : ord.status === "pending" ? (
                                                    <div>
                                                        <p>Pending</p>
                                                    </div>
                                                ) : ord.status === "cancelled" ? (
                                                    <div className='flex items-center gap-x-2'>
                                                        <Image src="/assets/img/cancel.png" alt='' width={45} height={45} />
                                                        <div>
                                                            <p className='capitalize font-semibold text-[18px] text-[#f64437] leading-tight'>cancelled</p>
                                                            <p>
                                                                On{" "}
                                                                {new Date(
                                                                    new Date(ord.updatedAt).setDate(
                                                                        new Date(ord.updatedAt).getDate()
                                                                    )
                                                                ).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "short",
                                                                    year: "numeric",
                                                                })}
                                                                {" "} as per your request
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : ord.status === "delivered" ? (
                                                    <div className='flex items-center gap-x-2'>
                                                        <Image src="/assets/img/booking.png" alt='' width={45} height={45} />
                                                        <div>
                                                            <p className='capitalize font-semibold text-[18px] text-[#05d134] leading-tight'>delivered</p>
                                                            <p>
                                                                On{" "}
                                                                {new Date(ord.updatedAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : ord.status === "returned" && (
                                                    <div className='flex items-center gap-x-2'>
                                                        <Image src="/assets/img/return.png" alt='' width={45} height={45} />
                                                        <div>
                                                            <p className='capitalize font-semibold text-[18px] text-[#f64437] leading-tight'>returned</p>
                                                            <p>
                                                                Your refund of <b>₹777.00</b> for the return has been processed successfully on{" "}
                                                                {new Date(ord.updatedAt).toLocaleDateString("en-IN", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {
                                                ord.items.map((item: any, j: number) => {
                                                    return (
                                                        <div key={j} className={`bg-white shadow p-3 my-3 rounded ${item.status == "cancelled" ? "grayscale-100" : ""} `}>
                                                            <div className='flex gap-x-3'>
                                                                {
                                                                    ord.status !== "cancelled" && ord.status !== "delivered" ? (
                                                                        <div>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedItems[ord._id]?.includes(item._id) || false}
                                                                                onChange={(e) => {
                                                                                    setSelectedItems(prev => {
                                                                                        const current = prev[ord._id] || [];

                                                                                        if (e.target.checked) {
                                                                                            return {
                                                                                                ...prev,
                                                                                                [ord._id]: [...current, item._id]
                                                                                            };
                                                                                        } else {
                                                                                            return {
                                                                                                ...prev,
                                                                                                [ord._id]: current.filter(id => id !== item._id)
                                                                                            };
                                                                                        }
                                                                                    });
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ) : null
                                                                }
                                                                <Image src={item.image} alt='cd' width={100} height={100} />
                                                                <div>
                                                                    <h3 className='text-[15px] font-semibold uppercase'>{item.brand}</h3>
                                                                    <p>{item.name}</p>
                                                                    <div className='flex items-center gap-x-2'>
                                                                        <p>Color : {item.productColor}</p>
                                                                        <span className='text-gray-400'>|</span>
                                                                        <p>Size : {item.productSize}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                item.status === "delivered" && (
                                                                    item.isReviewed ? (
                                                                        <UpdateReview
                                                                            reviewId={item.reviewId}
                                                                        />
                                                                    ) : (
                                                                        <div>
                                                                            <Review
                                                                                productId={item.productId?._id}
                                                                            />
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        {
                                            ord.status !== "cancelled" && ord.status !== "delivered" ? (
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        disabled={!selectedItems[ord._id] || selectedItems[ord._id].length === 0}
                                                        onClick={() => mutation.mutate({
                                                            orderId: ord._id,
                                                            items: selectedItems[ord._id]
                                                        })}
                                                        sx={{
                                                            py: "10px",
                                                            backgroundColor: "#313647",
                                                            color: "#FFF",
                                                            textTransform: "capitalize",
                                                        }}
                                                    >
                                                        Cancel Order
                                                    </Button>
                                                </div>

                                            ) : null
                                        }
                                    </div>
                                )
                            })
                        ) : (
                            <p>No Order Found</p>
                        )
                    )
                }
            </div>
        </div>
    )
}
