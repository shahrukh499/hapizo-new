"use client";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { Rating, Skeleton } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BrandsFilter from "../components/filters/BrandsFilter";
import CategoryFilter from "../components/filters/CategoryFilter";
import PriceFilter from "../components/filters/PriceFilter";
import { useQuery } from "@tanstack/react-query";
import HoverSplide from "../home/HoverSlider";
import FilterDrawer from "../components/filters/FilterDrawer";



function ProductsByCatogery() {
  const searchParams = useSearchParams();

  // ✅ Fetch function for react-query
  const fetchProductDetailsByCategory = async () => {
    const queryParams = searchParams.toString();
    if (!queryParams) return null;

    const apiUri = getApiUrl(
      `${API_CONFIG.ENDPOINTS.PRODUCTDETAILS}?${queryParams}`
    );

    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.GET
    );

    const response = await fetch(apiUri, {
      ...requestOptions,
      next: { revalidate: 60 },
    });
    const data = await response.json();

    if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
      return data;
    } else {
      throw new Error("Product Not Found");
    }
  };

  // ✅ Use TanStack Query
  const {
    data: products,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["productsByCategory", searchParams.toString()],
    queryFn: fetchProductDetailsByCategory,
    enabled: !!searchParams.toString(), // only run when params exist
    staleTime: 1000 * 60 * 5
  });

  //console.log(products, 'products');


  return (
    <section className="py-6 lg:py-12">
      <div className="container mx-auto px-2">
        <h2 className="text-[20px] lg:text-[25px] font-semibold">Product List</h2>
        <div className="flex flex-wrap border-t border-gray-200">
          <div className="w-full lg:w-[20%] lg:max-w-[300px] px-1.5 lg:border-r border-gray-200">
            <div className="py-1.5 hidden lg:block">
              <div>
                <h2 className="text-[20px] font-semibold">Filters</h2>
              </div>
              <CategoryFilter />
              <BrandsFilter />
              <PriceFilter />
            </div>
            <div className="block lg:hidden">
              <div className="pt-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px] font-semibold">Filters</h2>
                  <FilterDrawer/>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[80%] md:px-1.5">
            {isError && <p>{error.message}</p>}

            <div className="flex flex-wrap py-3 lg:gap-y-3">
              {isLoading ? (
                // Skeleton loaders
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[50%] md:w-[33.33%] lg:w-[25%] lg:px-1.5"
                  >
                    <div className="lg:shadow border border-gray-100 px-3 py-3 h-full">
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={180}
                        sx={{ mb: 1 }}
                      />
                      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1.5 }} />
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton variant="rectangular" width={100} height={20} />
                        <Skeleton variant="text" width={60} height={16} />
                      </div>
                    </div>
                  </div>
                ))
              ) : products?.products?.length > 0 ? (
                products?.products?.map((items:any, i:number) => (
                  items.isActive ? (
                    <div
                      key={i}
                      className="w-[50%] md:w-[33.33%] lg:w-[25%] lg:px-1.5"
                    >
                      <div className="lg:shadow border border-gray-100 lg:rounded h-full">
                        <div className='relative'>
                          <HoverSplide
                            thumbnails={items.thumbnails}
                            slug={items.slug}
                            eagerLoad={i === 0}
                          />
                          {
                            items.averageRating < 0 && (
                              <div className='absolute top-0 left-0 bg-[#ddddddc6] pt-[2px] px-1 m-2 rounded flex items-center gap-x-2'>
                                <span className='text-[13px] font-semibold'>{items.averageRating}<span className="w-5">⭐</span></span>
                              </div>
                            )
                          }
                        </div>
                        <div className="p-2">
                          <span className="capitalize text-[13px] text-gray-700">
                            {items.brand}
                          </span>
                          <Link href={`products/${items.slug}`} prefetch>
                            <h3 className="text-[16px] font-semibold leading-tight line-clamp-2">
                              {items.name}
                            </h3>
                          </Link>
                          <div className="flex flex-wrap gap-y-1 items-center gap-x-2 my-2">
                            <Rating
                              name="half-rating-read"
                              defaultValue={2.5}
                              precision={0.5}
                              size="small"
                              readOnly
                            />
                            <small className="text-gray-500">42 reviews</small>
                          </div>
                          <div className="flex gap-x-1 items-center">
                            <span className="font-semibold text-[13px] md:text-[14px]">
                              Rs. {items.displayPrice}
                            </span>
                            <span className="text-gray-400 text-[12px] line-through flex items-center">
                              <CurrencyRupeeIcon sx={{ fontSize: "12px" }} />
                              {parseInt(
                                items.displayPrice * (items.discount / 100) + items.displayPrice
                              )}
                            </span>
                            <span className="text-[12px] text-purple-700">{`(${items.discount}% OFF)`}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                ))
              ) : (
                !isLoading && <p>No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsByCatogery;
