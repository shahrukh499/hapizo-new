"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useDispatch, useSelector } from "react-redux"; // keep only for user
import { showSnackbar } from "../snackbar/snackbarSlice"; // remove later if moving to notistack only
import { useCartItems } from "@/app/cart/useCartItems";
import { useAddToCart } from "@/app/cart/useAddToCart";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

interface addCartPropsType {
    productId: string;
    stock: number;
    productSize: string;
    productColor: string;
    btnStyle: any
}

function AddCartsButton({ productId, stock, productSize, productColor, btnStyle } : addCartPropsType) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAppSelector((state) => state.authSlice);
  const dispatch = useAppDispatch();
  

  const { data: cart } = useCartItems(user);
  const addToCartMutation = useAddToCart();

  // Check if already in cart
  const existingItem = cart?.cart?.items?.some(
    (item : any) =>
      item?.products?._id === productId && item?.productSize === productSize && item?.productColor === productColor
  );
  

  const handleCartButton = () => {
    if (!user) {
      dispatch(showSnackbar({ message: 'You must Log In first', variant: "warning" }))
      return;
    }

    addToCartMutation.mutate(
      { productId, size: productSize, colour: productColor, quantity: 1, enqueueSnackbar },
    );
  };

  return (
    <>
      {existingItem ? (
        <Link className="w-full" href="/checkout/cart">
          <Button sx={btnStyle} variant="outlined">
            <LocalMallOutlinedIcon fontSize="small" /> Go to cart
          </Button>
        </Link>
      ) : stock <= 0 ? (
        <Button
          sx={{...btnStyle, bgcolor:'#c1c1c1'}}
          variant="outlined"
          disabled
        >
          <span className="text-white font-semibold">Product out of stock</span>
        </Button>
      ) : (
        <Button
          sx={btnStyle}
          onClick={handleCartButton}
          variant="outlined"
          disabled={addToCartMutation.isPending}
        >
          <LocalMallOutlinedIcon fontSize="small" />
          {addToCartMutation.isPending ? "Adding..." : "Add to cart"}
        </Button>
      )}
    </>
  );
}

export default AddCartsButton;
