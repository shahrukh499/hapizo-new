"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { fetchCartItems } from "@/app/cart/cartApi";

export function useCartItems(userArg : any) {
  const reduxUser = useSelector((state) => state.authSlice?.user);
  const user = userArg ?? reduxUser;

  return useQuery({
    queryKey: ["cartItems", user?._id ?? "guest"],
    queryFn: fetchCartItems,
    enabled: Boolean(user),
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 10,
  });
}