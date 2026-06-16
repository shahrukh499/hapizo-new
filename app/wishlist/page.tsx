"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button, Skeleton } from "@mui/material";
import { useWishlistItems } from "./useWishlistItems";
import WishlistCard from "./WishlistCard";
import { handleSignUpLoginModal } from "@/app/components/auth/loginsignupSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

function Wishlist() {
  const [isClient, setIsClient] = useState(false);
  const dispatch = useAppDispatch();

  // ✅ Auth from redux
  const { user } = useAppSelector((state) => state.authSlice);

  // ✅ TanStack Query for wishlist
  const { data: wishlist, isLoading, isError, error } = useWishlistItems(user);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // ---------- Render helpers ----------
  const renderLoadingState = () => (
    <section className="">
      <div className="">
        <div className="flex flex-wrap gap-y-3">
          <div className="w-full px-1.5">
            <Skeleton variant="rectangular" sx={{ maxWidth: "100%" }} width={1200} height={150} />
          </div>
        </div>
      </div>
    </section>
  );

  const renderUnauthenticatedState = () => (
    <section className="py-6 lg:py-12 h-[85vh]">
      <div className="container mx-auto px-2">
        <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
          My Wishlist
        </h2>
        <div className="h-[44vh] flex justify-center flex-col text-center">
          <Image
            className="mx-auto mb-5"
            src="/assets/img/security-lock.png"
            alt="empty wishlist"
            width={200}
            height={200}
            priority
          />
          <p className="text-[20px] lg:text-[25px] font-semibold">
            <span className="text-red-600">Login</span> To View Your Wishlist
          </p>
          <div className="mt-3">
            <Button
              onClick={() => dispatch(handleSignUpLoginModal(true))}
              variant="text"
              aria-label="Login to view wishlist"
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderEmptyWishlist = () => (
    <div className="h-[44vh] flex justify-center flex-col text-center">
      <Image
        className="mx-auto mb-5"
        src="/assets/img/empty-cart.png"
        alt="empty wishlist"
        width={200}
        height={200}
        priority
      />
      <p className="text-[20px] lg:text-[25px] font-semibold">
        Your Wishlist is <span className="text-red-600">Empty</span>
      </p>
      <p className="text-[14px] text-gray-500 mt-2">
        Add items to your wishlist to save them for later
      </p>
    </div>
  );

  const renderWishlistItems = () => {
    const items = wishlist?.wishlist || [];
    
    return (
      <div>
        <div className="flex flex-wrap gap-y-3">
          {items.map((product : any, i : number) => {
            return (
              <div
                key={`${product._id || i}-${i}`}
                className="w-[50%] md:w-[33.33%] lg:w-[25%] px-1.5"
              >
                <WishlistCard
                  _id={product._id}
                  wishlistItemId={product._id}
                  product={product}
                  products={product}
                  productId={product._id}
                  img={product.variants[0]?.images?.[0]}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  brand={product.brand}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ---------- Early returns ----------
  if (!isClient) {
    return (
      <section className="py-6 lg:py-12">
        <div className="container mx-auto px-2 md:px-12">
          <h2 className="text-[20px] lg:text-[25px] font-semibold mb-2 lg:mb-4">
            My Wishlist
          </h2>
          {renderLoadingState()}
        </div>
      </section>
    );
  }

  if (!user) {
    return renderUnauthenticatedState();
  }

  // ---------- Main render ----------
  const items = wishlist?.wishlist || [];
  
  return (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2 md:px-12">
        <h2 className="text-[20px] lg:text-[22px] font-semibold mb-2 lg:mb-4">
          My Wishlist
        </h2>

        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          <div className="text-red-600">
            <p>Error loading wishlist. Please try again later.</p>
            {error && <p className="text-sm mt-2">Error: {error.message}</p>}
          </div>
        ) : items.length > 0 ? (
          renderWishlistItems()
        ) : (
          renderEmptyWishlist()
        )}
      </div>
    </section>
  );
}

export default Wishlist;