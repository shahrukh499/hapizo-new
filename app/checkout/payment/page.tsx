"use client"
import Coupons from '@/app/cart/Coupons'
import PaymentDetails from '@/app/components/checkoutDetails/CheckoutDetails'
import PaymentMode from '@/app/components/payment/PaymentMode'
import React, { useMemo } from 'react'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined';

function Payment() {

    return (
        <section className='py-6 lg:py-12'>
            <div className='container mx-auto px-2'>
                <div className='flex items-center gap-x-3'>
                    <div className=' bg-purple-100 rounded-lg p-2 text-purple-700'>
                        <AccountBalanceWalletOutlinedIcon fontSize='large' />
                    </div>
                    <div>
                        <h1 className="text-[25px] lg:text-[27px] font-semibold leading-tight">
                            Select Payment Method
                        </h1>
                        <p className='text-gray-500 text-[15px]'>Choose a payment option to complete your order</p>
                    </div>
                </div>
                <div className='flex flex-wrap'>
                    <div className='w-full lg:w-[70%] overflow-x-hidden order-2 lg:order-1'>
                        <PaymentMode />
                    </div>
                    <div className='w-full lg:w-[30%] lg:ps-4 order-1 lg:order-2'>
                        <div className='px-3 py-5 mt-4 border-2 border-gray-200 rounded-2xl'>
                            <div className='flex items-center gap-x-2'>
                                <div className='bg-[#ff910041] p-2 rounded-lg'>
                                    <AccountBalanceWalletOutlinedIcon fontSize='medium' sx={{color:'#FF9100'}}/>
                                </div>
                                <h3 className='font-semibold text-[23px] mt-1'>Payment Summary</h3>
                            </div>
                            <div className='border-b-2 border-dashed border-gray-200 pb-4'>
                                <Coupons/>
                            </div>
                            <div>
                                <PaymentDetails />
                            </div>
                            <div className='mt-5'>
                                <div className='flex items-center gap-x-3 mb-3'>
                                    <div className='bg-purple-100 p-2 rounded-full'>
                                        <VerifiedUserOutlinedIcon sx={{color:'#8200db'}}/>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold'>Secure Payment</h5>
                                        <p className='text-[12px] text-gray-500'>100% secure and encrypted transactions</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-3 mb-3'>
                                    <div className='bg-purple-100 p-2 rounded-full'>
                                        <AutorenewOutlinedIcon sx={{color:'#8200db'}}/>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold'>Easy Returns</h5>
                                        <p className='text-[12px] text-gray-500'>7 days easy return policy</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-x-3'>
                                    <div className='bg-purple-100 p-2 rounded-full'>
                                        <DownloadDoneOutlinedIcon sx={{color:'#8200db'}}/>
                                    </div>
                                    <div>
                                        <h5 className='font-semibold'>Best Price</h5>
                                        <p className='text-[12px] text-gray-500'>You get the best price guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Payment