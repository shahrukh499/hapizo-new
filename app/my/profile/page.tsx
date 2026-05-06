'use client'
import ProfileSidenav from '@/app/components/profile/ProfileSidenav';
import UserProfileDetails from '@/app/components/profile/UserProfileDetail';
import React from 'react'


function UserProfile() {
  return (
    <section className='bg-[#eef2fb] md:h-screen lg:p-8'>
        <div className='container mx-auto px-2'>
          <div className='bg-[#FFFFFF] shadow rounded-xl md:h-[800px]'>
            <div className='flex flex-wrap h-full'>
                <div className='w-full lg:w-[25%]'>
                    <ProfileSidenav/>
                </div>
                <div className='w-full lg:w-[75%] p-6'>
                  <UserProfileDetails/>
                </div>
            </div>
          </div>
        </div>
    </section>
  )
}

export default UserProfile;