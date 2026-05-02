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
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ALLPRODUCTS);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.GET
      );

      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      // ✅ Sort newest first by createdAt
      const sortedProducts = data.products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return sortedProducts;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  const memoProducts = useMemo(() => products, [products]);

  return (
    <section>
    <Banner />
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap justify-center gap-y-4 gap-x-4">
          <div className="w-full md:w-[30%]">
            <div className="flex gap-2 items-center lg:justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px]" src='/assets/img/delivery-truck.png' alt="Image 1" width={100} height={100} />
              <div>
                <p className="text-[18px] lg:text-2xl font-bold">Fast Delivery</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600">Fast delivery on all orders</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[30%]">
            <div className="flex gap-2 items-center lg:justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px]" src='/assets/img/cash.png' alt="Image 2" width={100} height={100} />
              <div>
                <p className="text-[18px] lg:text-2xl font-bold">Secure Payment</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600">Flexible & Secure payment on all orders</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[30%]">
            <div className="flex gap-2 items-center lg:justify-center">
              <Image loading="eager" className="w-[50px] lg:w-[100px]" src='/assets/img/online-chat.png' alt="Image 3" width={100} height={100} />
              <div>
                <p className="text-[18px] lg:text-2xl font-bold">24/7 Support</p>
                <p className="text-[12px] lg:text-[14px] text-gray-600">24/7 Support on all orders</p>
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

    <Showcase1 />

    <section>
      <div className="container mx-auto px-2">
        <div className="py-3">
          <h2 className="text-center text-[20px] md:text-[30px] font-semibold">Latest Products</h2>
        </div>
        {
          isLoading ? (
            <div className="flex flex-wrap gap-y-3">
              {
                [...Array(10)].map((_, i) => {
                  return (
                    <div key={i} className="w-[50%] md:w-[33%] lg:w-[20%] px-0.5">
                      <div >
                        <Skeleton variant="rectangle" width={'100%'} height={250} />
                        <Skeleton variant="text" width={50} />
                        <Skeleton variant="text" width={'100%'} />
                        <Skeleton variant="text" width={100} />
                      </div>
                    </div>
                  )
                })
              }
            </div>
          ) : (
            <CategoryTab
              products={memoProducts}
            />
          )
        }
      </div>
    </section>

    <section className="pt-6">
      <div className="container mx-auto px-2">
        <div className="flex flex-wrap gap-y-3">
          <div className="w-full lg:w-[50%] md:px-1.5">
            <Image src='/assets/img/800X400.webp' alt="800X400" width={800} height={400} />
          </div>
          <div className="w-full lg:w-[50%] md:px-1.5">
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

    <section className="py-6">
      <div className="container mx-auto px-2">
        <Image src='/assets/img/1900X400.webp' alt="" width={1900} height={400} />
      </div>
    </section>

  </section>
  );
}
