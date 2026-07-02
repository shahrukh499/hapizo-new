import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { showSnackbar } from "../components/snackbar/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { API_CONFIG, getApiUrl } from "../utils/apiConfig";
import { useCartItems } from "./useCartItems";
import { applyCoupon, removeCoupon } from "./couponSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Image from "next/image";

function Coupons() {
    const [code, setCode] = useState("");
    const dispatch = useAppDispatch();
    const { data: cart } = useCartItems();
    const { appliedCoupon, couponCode, discount } = useAppSelector((state) => state.couponSlice);
    
    const cartTotalPrice = cart?.cart?.items?.reduce((acc:any, item:any) => {
        const price = item?.products?.price || 0;
        const quantity = item?.quantity || 1;
        return acc + price * quantity;
    }, 0) || 0;

    const subTotal = Number(cartTotalPrice.toFixed(2));

    const handleApplyCoupnApi = async () => {
        /*  if (code === appliedCode) {
              dispatch(
                showSnackbar({ message: "Coupon already applied", variant: "info" })
              );
              return;
            } */

        try {
            const payload = {
                code: code,
                cartTotal: subTotal,
                userId: cart?.cart?.userId,
            };

            const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.APPLYCOUPONCODE);
            const requestOptions = API_CONFIG.createRequestOptions(
                API_CONFIG.HTTP_METHODS.POST,
                payload as any
            );
            const response = await fetch(apiUri, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                // Create an error object with the API response message
                const error = new Error(data.message || "Failed to apply coupon") as any;
                error.response = data; // Attach response data for reference
                throw error;
            }
            return data;
        } catch (error) {
            // Re-throw the error so mutation's onError can handle it
            throw error;
        }
    };

    const mutation = useMutation({
        mutationFn: handleApplyCoupnApi,
        onSuccess: (data) => {
            // Store coupon data in Redux
            dispatch(applyCoupon({
                ...data,
                code: code,
            }));
            dispatch(showSnackbar({ message: data.message, variant: "success" }));
        },
        onError: (error) => {
            dispatch(showSnackbar({ 
                message: error?.message || "Failed to apply coupon", 
                variant: "error" 
            }));
        },
    });

    const handleRemoveCoupon = () => {
        dispatch(removeCoupon());
        setCode("");
        dispatch(showSnackbar({ message: "Coupon removed", variant: "info" }));
    };

    return (
        <div className="pt-4 w-full">
            {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div>
                        <p className="text-sm font-semibold text-green-800">
                            Coupon Applied: <span className="uppercase">{couponCode}</span>
                        </p>
                        <p className="text-xs text-green-600">
                            Discount: ₹{Math.round(discount)}
                        </p>
                    </div>
                    <button
                        onClick={handleRemoveCoupon}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                <div className="flex items-center w-full">
                    <div className="bg-purple-100 py-0 px-2 rounded border border-dashed border-purple-700">
                        <Image src='/assets/img/coupon.png' alt="" width={50} height={50} />
                    </div>
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="border rounded px-3 py-2.5 w-full uppercase"
                            placeholder="Enter Coupon Code"
                            disabled={mutation.isPending}
                        />
                        <button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending || !code.trim()}
                            className="px-6 py-2 bg-black text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed absolute right-[3px] top-1/2 -translate-y-1/2"
                        >
                            {mutation.isPending ? "Applying..." : "Apply"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Coupons;
