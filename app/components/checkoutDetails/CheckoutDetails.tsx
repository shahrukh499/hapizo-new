'use client'
import { useCartItems } from '@/app/cart/useCartItems';
import React from 'react'
import { useAppSelector } from '@/app/redux/hooks';

function PaymentDetails() {
    const { data: cart } = useCartItems();
    const { discount: couponDiscount, couponCode } = useAppSelector((state) => state.couponSlice);
    const cartTotalPrice = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc:any, item:any) => {
            const price = item?.price || 0;
            const discount = item?.discount || 0;
            const totalmrp = price * (discount / 100) + price
            const quantity = item?.quantity || 1;
            return acc + totalmrp * quantity;
        }, 0)
        : 0;

    const totalDiscount = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc:any, item:any) => {
            const price = item?.price || 0;
            const quantity = item?.quantity || 1;
            const discountPercent = item?.discount || 0;
            const discountAmount = price * quantity * (discountPercent / 100);
            return acc + discountAmount;
        }, 0)
        : 0;

    const subTotal = cartTotalPrice;
    const serviceCharge = 0;
    const shipping = 0;
    const grandTotal = subTotal + serviceCharge + shipping - totalDiscount - (couponDiscount || 0);

    return (
        <div>
            <div className="pt-5 pb-4 border-b border-gray-400 border-dashed">
                <div className="mb-3">
                    <p className="text-[12px] text-[#535766] font-semibold uppercase">
                        Price Details{" "}
                        <span>
                            ({cart?.cart?.items.length}{" "}
                            {cart?.cart?.items.length > 1 ? "Items" : "Item"})
                        </span>
                    </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-[14px]">Sub Total</span>
                    <span className="text-gray-600 text-[14px]">₹{Math.round(subTotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-[14px]">Discount</span>
                    <span className="text-green-600 text-[14px]">-₹{Math.round(totalDiscount)}</span>
                </div>
                {couponDiscount > 0 && (
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-600 text-[14px]">
                            Coupon Discount {/* <span className='uppercase font-semibold text-green-600'>{couponCode && `${couponCode}`}</span> */}
                        </span>
                        <span className="text-green-600 text-[14px]">-₹{Math.round(couponDiscount)}</span>
                    </div>
                )}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-[14px]">Additional Services</span>
                    <span className="text-red-600 text-[14px]">+₹{serviceCharge}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-[14px]">Shipping</span>
                    <span className="text-gray-600 text-[14px]">₹{shipping}</span>
                </div>
            </div>
            <div className="flex justify-between items-center my-4">
                <span className="font-bold">Total</span>
                <span className="font-bold">₹{grandTotal.toFixed(0)}</span>
            </div>
        </div>
    )
}

export default PaymentDetails