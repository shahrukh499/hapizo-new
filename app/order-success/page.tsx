"use client"
import { Button } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

function OrderComplete() {
  const router = useRouter()
  return (
    <section>
      <div
        className={`transition-opacity duration-1000 ease-in-out  min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-6 lg:p-8`}
      >
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg px-4 md:px-8 pb-8 pt-4 space-y-4 md:space-y-8">
          <div className="text-center">
            <Image className='mx-auto' src='/assets/img/confetti.gif' alt='gif' width={90} height={90} />
            <h1 className="mt-6 text-[20px] md:text-4xl font-extrabold text-gray-900">
              Order Placed Successfully!
            </h1>
            <p className="mt-2 text-[13px] md:text-lg text-gray-600">
              Thank you for shopping with us!
            </p>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 md:p-6 shadow-inner space-y-4">
            <h2 className="text-[18px] md:text-2xl font-bold text-gray-800 border-b pb-2">
              Order Summary
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">Order ID:</span>
                <span className="text-gray-900 text-[12px] md:text-[15px]">#123456789</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">
                  Payment Method:
                </span>
                <span className="text-gray-900 text-[12px] md:text-[15px]">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] md:text-[15px] font-semibold text-gray-700 w-full max-w-[130px]">
                  Delivery Address:
                </span>
                <span className="text-gray-900 text-[12px] md:text-[15px] text-right">
                  123 Main St, Anytown, USA 12345
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] md:text-[15px] font-semibold text-gray-700">
                  Estimated Delivery:
                </span>
                <span className="text-gray-900 text-[12px] md:text-[15px]">July 25, 2024</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t mt-4">
                <span className="text-gray-800 text-[15px] md:text-[18px]">Total Amount:</span>
                <span className="text-green-600 text-[15px] md:text-[18px]">$99.99</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="contained"
              sx={{
                width: '100%',
                backgroundColor: 'green',
                color: 'white',
                fontWeight: 'bold',
                py: 1.5,
                px: 3,
                borderRadius: 2,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#166534', // similar to hover:bg-green-700
                  transform: 'scale(1.05)',
                },
              }}
            >
              Track Order
            </Button>

            <Button
              onClick={()=>router.push('/')}
              variant="contained"
              sx={{
                width: '100%',
                backgroundColor: '#e5e7eb', // gray-200
                color: '#1f2937', // gray-800
                fontWeight: 'bold',
                py: 1.5,
                px: 3,
                borderRadius: 2,
                boxShadow: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#d1d5db', // gray-300
                  transform: 'scale(1.05)',
                },
              }}
            >
              Continue Shopping
            </Button>

          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderComplete