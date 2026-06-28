"use client";
import react, {useMemo} from 'react'
import Image from "next/image";
import { useEffect, useState } from "react";
import { API_CONFIG, getApiUrl } from "./utils/apiConfig";
import AddCartsButton from "./components/products/AddCartsButton";
import dynamic from 'next/dynamic';
import CategoryTab from "./home/CategoryTab";
import { useQuery } from "@tanstack/react-query";
import Banner from "./home/Banner";
import Showcase1 from "./home/Showcase1";
import { Skeleton } from "@mui/material";

export default function Home() {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [showcaseLoaded, setShowcaseLoaded] = useState(false);

  return (
    <section>
    <Banner onLoaded={() => setBannerLoaded(true)} />
    <section className="py-3 md:py-12">
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-4">
          <div className="w-[30%]">
            <div className="flex flex-wrap md:flex-nowrap gap-1 items-center justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px] " src='/assets/img/delivery-truck.png' alt="Image 1" width={100} height={100} />
              <div>
                <p className="text-[14px] lg:text-2xl font-semibold md:font-bold text-center md:text-left">Fast Delivery</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600 hidden md:block">Fast delivery on all orders</p>
              </div>
            </div>
          </div>
          <div className="w-[30%]">
            <div className="flex flex-wrap md:flex-nowrap gap-1 items-center justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px] " src='/assets/img/cash.png' alt="Image 2" width={100} height={100} />
              <div>
                <p className="text-[14px] lg:text-2xl font-semibold md:font-bold text-center md:text-left">Secure Payment</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600 hidden md:block">Flexible & Secure payment on all orders</p>
              </div>
            </div>
          </div>
          <div className="w-[30%]">
            <div className="flex flex-wrap md:flex-nowrap gap-1 items-center justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px] " src='/assets/img/trust.png' alt="Image 3" width={100} height={100} />
              <div>
                <p className="text-[14px] lg:text-2xl font-semibold md:font-bold text-center md:text-left">100% Trusted</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600 hidden md:block">Shop with confidence, delivered with trust.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* <section className="pb-3">
        <div className="container mx-auto px-2">
          <div className="flex flex-wrap justify-center gap-y-4">
            <div className="w-full md:w-[46%] 2xl:w-[45.5%] px-1.5">
              <Image src='/assets/img/1000X1200.webp' alt="Image 1" width={1000} height={1200}/>
            </div>
            <div className="w-full md:w-[54%] 2xl:w-[54.5%] px-1.5">
              <Image className="mb-3" src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400}/>
              <Image src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400}/>
            </div>
          </div>
        </div>
      </section> */}

    {/*  <section>
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap justify-center gap-y-4">
          <div className="w-full md:w-[35%] 2xl:w-[35%] px-1.5">
            <Link href="/tshirt?category=tshirt">
              <Image src='/assets/img/newSales.webp' alt="Image 1" width={1000} height={1000} />
            </Link>
          </div>
          <div className="w-full md:w-[65%] 2xl:w-[65%] px-1.5">
            <div className="flex gap-x-3 mb-3">
              <div>
                <Link href="tshirt?brand=ven heusen">
                  <Image src='/assets/img/fri-sale.webp' alt="Image 1" width={800} height={400} />
                </Link>
              </div>
              <div>
                <Image src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400} />
              </div>
            </div>
            <div>
              <Image src='/assets/img/1200X325.webp' alt="Image 1" width={1200} height={330} />
            </div>
          </div>
        </div>
      </div>
    </section> */}

    <Showcase1 
      enabled={bannerLoaded}
      onLoaded={() => setShowcaseLoaded(true)}
    />

    <section>
      <div className="container mx-auto px-2">
        <div className="py-3">
          <h2 className="text-center text-[20px] md:text-[30px] font-semibold">Latest Products</h2>
        </div>
            <CategoryTab enabled={showcaseLoaded} />
      </div>
    </section>

    <section className="pt-3">
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap gap-y-3">
          <div className="w-full md:w-[50%] md:pe-1.5">
            <Image src='/assets/img/800X400.webp' alt="800X400" width={800} height={400} />
          </div>
          <div className="w-full md:w-[50%] md:pl-1.5">
            <Image src='/assets/img/800X400.webp' alt="800X400" width={800} height={400} />
          </div>
        </div>
      </div>
    </section>
    {/* <section className="pt-6">
      <div className="container mx-auto px-2">
        <Splide
          options={{
            rewind: true,
            gap: '1rem',
            perPage: 5,
            breakpoints: {
              1440: {
                perPage: 4
              },
              1200: {
                perPage: 3
              },
              500: {
                perPage: 1
              }
            }
          }}
          aria-label="My Favorite Images"
        >
          {
            [...Array(10)].map((_, i) => {
              return (
                <SplideSlide key={i}>
                  <Image className="block m-auto" src='/assets/img/500X500.webp' alt="Image 1" width={500} height={500} />
                </SplideSlide>

              )
            })
          }
        </Splide>
      </div>
    </section> */}

    <section className="py-3">
      <div className="container mx-auto px-2">
        <Image src='/assets/img/1900X400.webp' alt="" width={1900} height={400} />
      </div>
    </section>

  </section>
  );
}
