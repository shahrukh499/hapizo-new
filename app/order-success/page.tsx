import React, { Suspense } from 'react'
import OrderComplete from '@/app/order-success/OrderComplete'

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderComplete/>
    </Suspense>
  )
}

export default page