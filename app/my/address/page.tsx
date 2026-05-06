import ProfileSidenav from '@/app/components/profile/ProfileSidenav'
import UserAddressDetails from '@/app/components/profile/UserAddressDetails'
import React from 'react'

function page() {
  return (
    <section className='bg-[#eef2fb] lg:p-8'>
    <div className='container mx-auto px-2'>
      <div className='bg-[#FFFFFF] shadow rounded-xl h-full'>
        <div className='flex flex-wrap h-full'>
            <div className='w-full lg:w-[25%]'>
                <ProfileSidenav/>
            </div>
            <div className='w-full lg:w-[75%] p-6 h-full'>
              <UserAddressDetails/>
            </div>
        </div>
      </div>
    </div>
</section>
  )
}

export default page