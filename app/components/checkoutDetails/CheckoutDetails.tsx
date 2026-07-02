'use client'
import { useCartItems } from '@/app/cart/useCartItems';
import React from 'react'
import { useAppSelector } from '@/app/redux/hooks';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

function PaymentDetails() {
    const { data: cart } = useCartItems();
    const { discount: couponDiscount, couponCode } = useAppSelector((state) => state.couponSlice);
    const cartTotalPrice = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc: any, item: any) => {
            const price = item?.price || 0;
            const discount = item?.discount || 0;
            const totalmrp = price * (discount / 100) + price
            const quantity = item?.quantity || 1;
            return acc + totalmrp * quantity;
        }, 0)
        : 0;

    const totalDiscount = Array.isArray(cart?.cart?.items)
        ? cart.cart.items.reduce((acc: any, item: any) => {
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
                {/* <div className="flex items-center gap-x-2 mb-3">
                    <div className='bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                        <LocalMallIcon fontSize='small' />
                    </div>
                    <p className="text-[12px] text-[#535766] font-semibold uppercase">
                        Price Details{" "}
                        <span>
                            ({cart?.cart?.items.length}{" "}
                            {cart?.cart?.items.length > 1 ? "Items" : "Item"})
                        </span>
                    </p>
                </div> */}
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center gap-x-2'>
                        <div className='bg-indigo-100 text-indigo-500 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                            <LocalMallIcon fontSize='small' />
                        </div>
                        <p className="text-gray-600 text-[14px]">Total MRP{" "}
                            <span>
                                ({cart?.cart?.items.length}{" "}
                                {cart?.cart?.items.length > 1 ? "Items" : "Item"})
                            </span></p>
                    </div>
                    <span className="text-gray-600 text-[14px]">₹{Math.round(subTotal)}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center gap-x-2'>
                        <div className='bg-green-100 text-green-700 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                            <LocalOfferIcon fontSize='small' />
                        </div>
                        <span className="text-gray-600 text-[14px]">Discount on MRP</span>
                    </div>
                    <span className="text-green-600 text-[14px]">-₹{Math.round(totalDiscount)}</span>
                </div>
                {couponDiscount > 0 && (
                    <div className="flex items-center justify-between mb-3">
                        <div className='flex items-center gap-x-2'>
                            <div className='bg-amber-100 text-amber-500 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                                <ConfirmationNumberIcon fontSize='small' />
                            </div>
                            <span className="text-gray-600 text-[14px]">
                                Coupon Discount {/* <span className='uppercase font-semibold text-green-600'>{couponCode && `${couponCode}`}</span> */}
                            </span>
                        </div>
                        <span className="text-green-600 text-[14px]">-₹{Math.round(couponDiscount)}</span>
                    </div>
                )}
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center gap-x-2'>
                        <div className='bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                            <AddModeratorIcon fontSize='small' />
                        </div>
                        <span className="text-gray-600 text-[14px]">Additional Services</span>
                    </div>
                    <span className="text-red-600 text-[14px]">+₹{serviceCharge}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <div className='flex items-center gap-x-2'>
                        <div className='bg-sky-100 text-sky-600 rounded-full w-8 h-8 flex justify-center flex-col items-center'>
                            <LocalShippingIcon fontSize='small' />
                        </div>
                        <span className="text-gray-600 text-[14px]">Shipping</span>
                    </div>
                    <span className="text-gray-600 text-[14px]">₹{shipping}</span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4 bg-purple-50 p-3 rounded-lg">
                <div>
                    <h4 className="font-bold text-[17px] leading-tight text-[#8200db]">Total Amount</h4>
                    <p className='text-[12px] text-gray-500'>Inclusive of all taxes</p>
                </div>
                <h4 className="font-bold text-[23px] leading-tight text-[#8200db] mt-1.5">₹{grandTotal.toFixed(0)}</h4>
            </div>
        </div>
    )
}

export default PaymentDetails