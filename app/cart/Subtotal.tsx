"use client";
import { Button } from "@mui/material";
import React, { useState } from "react";
/* import { useDispatch } from "react-redux";
import { API_CONFIG, getApiUrl } from "../utils/apiConfig";
import { showSnackbar } from "../components/snackbar/snackbarSlice";
import { useCartItems } from "./useCartItems"; */
import { useRouter } from "next/navigation";
import PaymentDetails from "../components/checkoutDetails/CheckoutDetails";
/* import Coupons from "./Coupons";
 */
function Subtotal() {
/*   const [code, setCode] = useState("");
  const [finalPrize, setFinalPrize] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const { data: cart } = useCartItems();
  const dispatch = useDispatch(); */
  const routes = useRouter();


 /*  const cartTotalPrice = cart?.cart?.items?.reduce((acc, item) => {
    const price = item?.products?.price || 0;
    const quantity = item?.quantity || 1;
    return acc + price * quantity;
  }, 0);

  const subTotal = Number(cartTotalPrice.toFixed(2));
  const discount = 50;
  const serviceCharge = 30;
  const shipping = 0;
  const grandTotal = subTotal + serviceCharge + shipping - discount; */

  /* const handleApplyCoupnApi = async () => {
    if (code === appliedCode) {
      dispatch(
        showSnackbar({ message: "Coupon already applied", variant: "info" })
      );
      return;
    }

    try {
      const payload = {
        code: code,
        cartTotal: 599,
        userId: cart?.cart?.userId,
      };

      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.APPLYCOUPONCODE);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.POST,
        payload
      );
      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (response.ok) {
        setFinalPrize(data.finalAmount);
        setDiscountValue(data.discount);
        setAppliedCode(code);
        dispatch(showSnackbar({ message: data.message, variant: "success" }));
      } else {
        dispatch(showSnackbar({ message: data.message, variant: "error" }));
      }
    } catch (error) {
      console.error(error);
    }
  }; */


  return (
    <div className="h-full relative">
      {/* <div className="flex items-start gap-x-1 pb-4 border-b-1 border-dashed border-gray-200">
        <Coupons/>
      </div> */}

      <PaymentDetails/>

      <div className="lg:absolute bottom-11 w-full">
        <Button
          onClick={() => routes.push("/checkout/address")}
          sx={{
            py: "10px",
            width: "100%",
            backgroundColor: "#313647",
            color: "#FFF",
            textTransform: "capitalize",
          }}
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

export default Subtotal;
