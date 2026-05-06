"use client"
import Coupons from '@/app/cart/Coupons'
import PaymentDetails from '@/app/components/checkoutDetails/CheckoutDetails'
import PaymentMode from '@/app/components/payment/PaymentMode'
import React, { useMemo } from 'react'

function Payment() {

    return (
        <section className='py-6 lg:py-12'>
            <div className='container mx-auto px-2'>
                <div>
                    <h1 className="text-[20px] lg:text-[22px] font-semibold mb-2 lg:mb-4">
                        Select Payment Method
                    </h1>
                </div>
                <div className='flex flex-wrap'>
                    <div className='w-full lg:w-[70%] overflow-x-hidden lg:border-t lg:border-r border-gray-200 lg:px-2'>
                        <PaymentMode />
                    </div>
                    <div className='w-full lg:w-[30%] lg:ps-3 border-t border-gray-200'>
                        <div>
                            <Coupons/>
                        </div>
                        <div>
                            <PaymentDetails />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Payment