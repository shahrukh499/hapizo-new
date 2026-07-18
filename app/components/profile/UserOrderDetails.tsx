import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { Button, Skeleton } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import Review from "./Revew";
import UpdateReview from "./UpdateReview";
import { useAppDispatch } from "@/app/redux/hooks";
import { showSnackbar } from "../snackbar/snackbarSlice";
import SideNavbarMobile from "./SideNavbarMobile";

export default function UserOrderDetails() {
    const [selectedItems, setSelectedItems] = useState<{
        [orderId: string]: string[];
    }>({});
    const [returnOrderId, setReturnOrderId] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    //console.log(selectedItems, "ss")

    const isReturnEligible = (deliveredAt: string) => {
        const deliveryDate = new Date(deliveredAt);
        const today = new Date();

        deliveryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (today.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        return diffDays >= 0 && diffDays <= 7;
    };

    const handleUserOrders = async () => {
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ORDERLIST);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.GET,
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch products");
        }

        return data;
    };

    const {
        data: orders,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["orders"],
        queryFn: handleUserOrders,
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
    });

    //console.log(orders,'order');

    const handleMultiCancel = async (id: any) => {
        //console.log(id, "id");
        //console.log(selectedItems, "selectedItems");
        const payload = {
            orderId: id.orderId,
            itemIds: id.items,
        };
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.CANCELORDER);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any,
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
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            dispatch(
                showSnackbar({
                    message: data.message || "Order Cancel Successfully",
                    variant: "success",
                }),
            );
        },
        onError: (error) => {
            dispatch(showSnackbar({ message: error.message, variant: "error" }));
        },
    });

    return (
        <div>
            <div className="mb-5 flex justify-between items-center">
                <h1 className="text-[25px] font-semibold">All Orders</h1>
                <div className="lg:hidden">
                    <SideNavbarMobile />
                </div>
            </div>
            <div>
                {isLoading ? (
                    <Skeleton
                        sx={{ mb: 2, borderRadius: 3 }}
                        variant="rectangular"
                        animation="wave"
                        width={`100%`}
                        height={200}
                    />
                ) : orders?.orders?.length > 0 ? (
                    orders?.orders?.map((ord: any, i: number) => {
                        const canSelectItems =
                            (
                                ord.status === "confirmed" &&
                                !ord.shipmentCreated
                            ) ||

                            (
                                ord.status === "delivered" &&
                                ord.deliveredAt &&
                                isReturnEligible(ord.deliveredAt) &&
                                returnOrderId === ord._id
                            );
                        const canCancelOrder =
                            ord.status === "confirmed" &&
                            !ord.shipmentCreated;
                        return (
                            <div key={i} className="bg-gray-200 my-3 rounded p-3">
                                <div>
                                    {ord.status === "confirmed" && (
                                        <div className="flex items-center gap-x-2">
                                            {
                                                ord.shipmentCreated ? (
                                                    <Image
                                                        src="/assets/img/shipment-created.png"
                                                        alt=""
                                                        width={45}
                                                        height={45}
                                                    />
                                                ) : (
                                                    <Image
                                                        src="/assets/img/confirmed.png"
                                                        alt=""
                                                        width={45}
                                                        height={45}
                                                    />
                                                )
                                            }

                                            <div>
                                                <p className="capitalize font-semibold text-[18px] text-[#05d134] leading-tight">
                                                    {ord.shipmentCreated
                                                        ? "Shipment Created"
                                                        : "Confirmed"}
                                                </p>

                                                {ord.shipmentCreated ? (
                                                    <>
                                                        <p className="text-[14px]">
                                                            Your shipment has been created successfully.
                                                        </p>

                                                        {ord.courierName && (
                                                            <p className="text-[13px] text-gray-600">
                                                                Courier : {ord.courierName}
                                                            </p>
                                                        )}

                                                        {ord.awbNumber && (
                                                            <p className="text-[13px] text-gray-600">
                                                                AWB : {ord.awbNumber}
                                                            </p>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-[14px]">
                                                        Estimated Delivery{" "}
                                                        {ord.expectedDeliveryDate
                                                            ? new Date(
                                                                ord.expectedDeliveryDate,
                                                            ).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })
                                                            : `${new Date(
                                                                new Date(ord.createdAt).setDate(
                                                                    new Date(ord.createdAt).getDate() + 5,
                                                                ),
                                                            ).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })} - ${new Date(
                                                                new Date(ord.createdAt).setDate(
                                                                    new Date(ord.createdAt).getDate() + 9,
                                                                ),
                                                            ).toLocaleDateString("en-IN", {
                                                                day: "numeric",
                                                                month: "short",
                                                            })}`}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {ord.status === "shipped" && (
                                        <div className="flex items-center gap-x-2">
                                            <Image
                                                src="/assets/img/box.png"
                                                alt=""
                                                width={45}
                                                height={45}
                                            />

                                            <div>
                                                <p className="capitalize font-semibold text-[18px] text-[#ff9800] leading-tight">
                                                    {ord.currentTrackingStatus || "Shipped"}
                                                </p>

                                                {ord.courierName && (
                                                    <p className="text-[14px]">
                                                        Courier : {ord.courierName}
                                                    </p>
                                                )}

                                                {ord.awbNumber && (
                                                    <p className="text-[14px]">AWB : {ord.awbNumber}</p>
                                                )}

                                                {ord.expectedDeliveryDate && (
                                                    <p className="text-[13px] text-gray-600">
                                                        Expected Delivery :{" "}
                                                        {new Date(
                                                            ord.expectedDeliveryDate,
                                                        ).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
                                                )}

                                                {ord.trackingUrl && (
                                                    <a
                                                        href={ord.trackingUrl}
                                                        target="_blank"
                                                        className="text-blue-600 underline text-sm"
                                                    >
                                                        Track Package
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {ord.status === "delivered" && (
                                        <div className="flex items-center gap-x-2">
                                            <Image
                                                src="/assets/img/booking.png"
                                                alt=""
                                                width={45}
                                                height={45}
                                            />

                                            <div>
                                                <p className="capitalize font-semibold text-[18px] text-[#05d134] leading-tight">
                                                    Delivered
                                                </p>

                                                <p>
                                                    Delivered on{" "}
                                                    {ord.deliveredAt
                                                        ? new Date(ord.deliveredAt).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            },
                                                        )
                                                        : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {ord.status === "cancelled" && (
                                        <div className="flex items-center gap-x-2">
                                            <Image
                                                src="/assets/img/cancel.png"
                                                alt=""
                                                width={45}
                                                height={45}
                                            />

                                            <div>
                                                <p className="capitalize font-semibold text-[18px] text-red-600 leading-tight">
                                                    Cancelled
                                                </p>

                                                <p>
                                                    {ord.shipmentCancelled
                                                        ? "Shipment has been cancelled."
                                                        : "Order has been cancelled."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {ord.status === "returned" && (
                                        <div className="flex items-center gap-x-2">
                                            <Image
                                                src="/assets/img/return.png"
                                                alt=""
                                                width={45}
                                                height={45}
                                            />

                                            <div>
                                                <p className="capitalize font-semibold text-[18px] text-red-600 leading-tight">
                                                    Returned
                                                </p>

                                                <p>Return completed successfully.</p>
                                            </div>
                                        </div>
                                    )}
                                    {ord.items.map((item: any, j: number) => {
                                        return (
                                            <div
                                                key={j}
                                                className={`bg-white shadow p-3 my-3 rounded ${item.status == "cancelled" ? "grayscale-100" : ""} `}
                                            >
                                                <div className="flex gap-x-3">
                                                    {canSelectItems &&
                                                        item.status !== "cancelled" &&
                                                        item.status !== "returned" &&
                                                        (
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={
                                                                        selectedItems[ord._id]?.includes(item._id) ||
                                                                        false
                                                                    }
                                                                    onChange={(e) => {
                                                                        setSelectedItems((prev) => {
                                                                            const current = prev[ord._id] || [];

                                                                            if (e.target.checked) {
                                                                                return {
                                                                                    ...prev,
                                                                                    [ord._id]: [...current, item._id],
                                                                                };
                                                                            }

                                                                            return {
                                                                                ...prev,
                                                                                [ord._id]: current.filter(
                                                                                    (id) => id !== item._id,
                                                                                ),
                                                                            };
                                                                        });
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    <Image
                                                        src={item.image || "/assets/img/broken-image.jpg"}
                                                        alt="cd"
                                                        width={100}
                                                        height={100}
                                                    />
                                                    <div>
                                                        <h3 className="text-[15px] font-semibold uppercase">
                                                            {item.brand}
                                                        </h3>
                                                        <p>{item.name}</p>
                                                        <div className="flex items-center gap-x-2">
                                                            <p>Color : {item.productColor}</p>
                                                            <span className="text-gray-400">|</span>
                                                            <p>Size : {item.productSize}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {item.status === "delivered" &&
                                                    (item.isReviewed ? (
                                                        <UpdateReview reviewId={item.reviewId} />
                                                    ) : (
                                                        <div>
                                                            <Review productId={item.productId?._id} />
                                                        </div>
                                                    ))}
                                            </div>
                                        );
                                    })}
                                </div>

                                {canCancelOrder && (
                                    <div>
                                        <Button
                                            variant="contained"
                                            disabled={
                                                mutation.isPending ||
                                                !selectedItems[ord._id] ||
                                                selectedItems[ord._id].length === 0
                                            }
                                            onClick={() =>
                                                mutation.mutate({
                                                    orderId: ord._id,
                                                    items: selectedItems[ord._id],
                                                })
                                            }
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
                                )}
                                {ord.status === "delivered" &&
                                    ord.deliveredAt &&
                                    isReturnEligible(ord.deliveredAt) && (
                                        <Button
                                            variant="contained"
                                            onClick={() => setReturnOrderId(ord._id)}
                                            sx={{
                                                py: "10px",
                                                ml: 2,
                                                backgroundColor: "#1976d2",
                                                color: "#fff",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            {returnOrderId === ord._id ? "Select Items" : "Return Order"}
                                        </Button>
                                    )}
                            </div>
                        );
                    })
                ) : (
                    <p>No Order Found</p>
                )}
            </div>
        </div>
    );
}
