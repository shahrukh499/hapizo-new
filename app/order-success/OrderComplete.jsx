"use client";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

function OrderComplete() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const street = searchParams.get("street");
  const city = searchParams.get("city");
  const state = searchParams.get("state");
  const zip = searchParams.get("zip");
  const amount = searchParams.get("amount");
  const deliveryDate = searchParams.get("deliveryDate");

  const estimatedDeliveryDate = deliveryDate
    ? new Date(deliveryDate)
    : new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
  const formattedEstimatedDeliveryDate =
    estimatedDeliveryDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="bg-[url('/assets/img/bg-12.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center pt-0 pb-13 lg:pt-12 lg:pb-12">
      <div className={`p-2 sm:p-6 lg:p-8`}>
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl px-4 md:px-8 pb-8 pt-8 space-y-2 md:space-y-3">
          <div className="text-center">
            <Image
              className="mx-auto h-12 w-auto"
              src="/assets/img/bg-13.png"
              alt="gif"
              width={310}
              height={310}
            />
            <h1 className="mt-2 text-[20px] md:text-3xl font-extrabold text-gray-900">
              Order Placed Successfully!
            </h1>
            <p className="text-[13px] md:text-lg text-gray-600">
              Thank you for shopping with us!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 md:p-4 shadow-inner space-y-3">
            <div className="flex items-center gap-x-3 border-b-2 border-gray-200 pb-3">
              <div className="bg-purple-100 text-purple-700 p-2 rounded-full">
                <DescriptionIcon />
              </div>
              <h2 className="text-[18px] md:text-2xl font-bold text-gray-800 mt-1">
                Order Summary
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b-2 border-dotted border-gray-200 pb-3">
                <div className="flex items-center gap-x-2">
                  <div className="bg-sky-100 text-sky-600 px-2 py-1.5 rounded-full inline-block">
                    <ContactPageOutlinedIcon fontSize="small" />
                  </div>
                  <span className="text-[12px] md:text-[15px] font-semibold text-gray-700 mt-1">
                    Order ID
                  </span>
                </div>
                <span className="text-gray-900 text-[12px] md:text-[15px] mt-1">
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-dotted border-gray-200 pb-3">
                <div className="flex items-center gap-x-2">
                  <div className="bg-indigo-100 text-indigo-600 px-2 py-1.5 rounded-full inline-block">
                    <AccountBalanceWalletOutlinedIcon fontSize="small" />
                  </div>
                  <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">
                    Payment Method
                  </span>
                </div>
                <span className="text-gray-900 text-[12px] md:text-[15px]">
                  {paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center border-b-2 border-dotted border-gray-200 pb-3">
                <div className="flex items-center gap-x-2 w-full">
                  <div className="bg-lime-100 text-lime-500 px-2 py-1.5 rounded-full inline-block">
                    <HomeWorkOutlinedIcon fontSize="small" />
                  </div>
                  <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">
                    Delivery Address
                  </span>
                </div>
                <span className="text-gray-900 text-[12px] md:text-[15px] text-right">
                  {street}, {city}, {state} - {zip}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-x-2">
                  <div className="bg-yellow-100 text-yellow-600 px-2 py-1.5 rounded-full inline-block">
                    <CalendarMonthOutlinedIcon fontSize="small" />
                  </div>
                  <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">
                    Estimated Delivery
                  </span>
                </div>
                <span className="text-gray-900 text-[12px] md:text-[15px]">
                  {formattedEstimatedDeliveryDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xl font-bold py-3 rounded-lg bg-purple-100 px-4">
            <span className="text-purple-600 text-[15px] md:text-[18px]">
              Total Amount
            </span>
            <span className="text-purple-600 text-[15px] md:text-[18px]">
              ₹{amount}
            </span>
          </div>
          <div className="flex flex-row gap-4">
            <Link
              href={`/my/orders`}
              className="w-full text-center text-[11px] lg:text-[16px] bg-[#313647] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#1a1d28] transition duration-300 flex items-center justify-center lg:gap-x-2"
            >
              <LocalShippingOutlinedIcon fontSize="small" />{" "}
              <span className="ml-1 mt-0.5">Track Order</span>
            </Link>

            <Link
              href={`/`}
              className="w-full text-center text-[11px] lg:text-[16px] bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition duration-300 flex items-center justify-center lg:gap-x-2"
            >
              <ShoppingBagOutlinedIcon fontSize="small" />{" "}
              <span className="ml-1 mt-1">Continue Shopping</span>
            </Link>
          </div>
        </div>
        <div className="lg:flex justify-between items-center px-4 pt-5 space-y-1">
          <div className="flex items-center gap-x-1">
            <div className="text-lime-500">
              <GppGoodOutlinedIcon fontSize="small" />
            </div>
            <span className="ml-1 mt-0.5 text-gray-600 text-[15px]">
              We ensure safe and secure delivery
            </span>
          </div>
          <div className="flex items-center gap-x-1">
            <div className="text-lime-500">
              <HeadsetMicOutlinedIcon fontSize="small" />
            </div>
            <div>
              <span className="ml-1 mt-0.5 text-gray-600 text-[15px]">Need Help?</span>&nbsp;
              <Link href="/" className="text-lime-500 text-[15px] font-semibold">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderComplete;
