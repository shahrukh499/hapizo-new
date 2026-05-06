"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Skeleton } from "@mui/material";
import { useCartItems } from "@/app/cart/useCartItems";
import CartCard from "@/app/cart/CartCard";
import Subtotal from "@/app/cart/Subtotal";
import { handleSignUpLoginModal } from "@/app/components/auth/loginsignupSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

function Cart() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  // ✅ Auth from redux
  const { user } = useAppSelector((state) => state.authSlice);

  // ✅ TanStack Query for cart
  const { data: cart, isLoading, isError } = useCartItems(user);

  //console.log(cart,'cart');
  

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ---------- Render helpers ----------
  const renderLoadingState = () => (
    <section className="">
      <div className="">
        <div className="flex flex-wrap gap-y-3">
          <div className="w-full lg:w-[70%] px-1.5">
            <Skeleton variant="rectangular" sx={{ maxWidth: "100%" }} width={1200} height={150} />
          </div>
          <div className="w-full lg:w-[30%] px-1.5">
            <Skeleton animation="wave" variant="rectangular" sx={{ maxWidth: "100%", height: "100%" }} width={500} height={500} />
          </div>
        </div>
      </div>
    </section>
  );

  const renderUnauthenticatedState = () => (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2">
        <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
          Shopping Cart
        </h2>
        <div className="h-[44vh] flex justify-center flex-col text-center">
          <Image
            className="mx-auto mb-5"
            src="/assets/img/security-lock.png"
            alt="empty cart"
            width={200}
            height={200}
            priority
          />
          <p className="text-[20px] lg:text-[25px] font-semibold">
            <span className="text-red-600">Login</span> To View Your Cart Items
          </p>
          <div className="mt-3">
            <Button
              onClick={() => dispatch(handleSignUpLoginModal(true))}
              variant="text"
              aria-label="Login to view cart"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderEmptyCart = () => (
    <div className="h-[44vh] flex justify-center flex-col text-center">
      <Image
        className="mx-auto mb-5"
        src="/assets/img/empty-cart.png"
        alt="empty cart"
        width={200}
        height={200}
        priority
      />
      <p className="text-[20px] lg:text-[25px] font-semibold">
        Your Cart is <span className="text-red-600">Empty</span>
      </p>
    </div>
  );

  const renderCartItems = () => (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-[70%] lg:h-[545px] overflow-x-hidden overflow-y-auto lg:border-t lg:border-r border-gray-200 lg:px-2">
        {/*  <div className="my-3 p-3 rounded shadow border border-[#f0f0f0] bg-[#f8dfff9e]">
          <div className="flex flex-wrap">
              <div className="w-full lg:w-[70%]">
                <p className="text-[12px]">Deliver to : <span className="font-semibold">Mohammad Shahrukh</span>, <span className="font-semibold">700039</span></p>
                <p className="text-[12px]">47/1 G J Khan Road Topsia, <span>Kolkata</span>, <span>West Bengal</span> - <span>700039</span></p>
              </div>
              <div className="w-full lg:w-[30%]">
                <Button sx={{display:'block', marginLeft:'auto'}} variant="outlined">Change Address</Button>
              </div>
          </div>
        </div> */}
        {cart?.cart?.items?.map((item:any, i:number) => (
          <div
            key={`${item?._id}-${i}`}
            className="border-1 border-gray-200 p-[8px] my-[10px] rounded"
          >
            <CartCard
              id={item?._id}
              name={item?.name}
              img={item?.image}
              price={item?.price}
              qty={item?.quantity}
              productId={item?.productId}
              productSize={item?.productSize}
              productColor={item?.productColor}
              discount={item?.discount}
            />
          </div>
        ))}
      </div>
      <div className="w-full lg:w-[30%] lg:ps-3 border-t border-gray-200">
        <div className="lg:px-2 py-3 h-full">
          <h2 className="text-[20px] lg:text-[20px] font-semibold mb-3">
            Payment Summary
          </h2>
          <Subtotal />
        </div>
      </div>
    </div>
  );

  /*  const renderBackdropLoader = () => (
     <Backdrop
       sx={(theme) => ({
         color: "#fff",
         zIndex: theme.zIndex.drawer + 1,
       })}
       open={isFetching}
     >
       <CircularProgress color="inherit" />
     </Backdrop>
   ); */

  // ---------- Early returns ----------
  if (!isClient) {
    return (
      <section className="py-6 lg:py-12">
        <div className="container mx-auto px-2 md:px-12">
          <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
            Shopping Cart
          </h2>
          {renderLoadingState()}
        </div>
      </section>
    )
  }

  if (!user) {
    return renderUnauthenticatedState();
  }

  // ---------- Main render ----------
  return (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2 md:px-12">
        <h2 className="text-[20px] lg:text-[22px] font-semibold mb-2 lg:mb-4">
          Shopping Cart
        </h2>

        {/* {renderBackdropLoader()} */}

        {isLoading ? (
          renderLoadingState()
        ) : cart?.cart?.items?.length > 0 ? (
          renderCartItems()
        ) : (
          renderEmptyCart()
        )}
      </div>
    </section>
  );
}

export default Cart;
