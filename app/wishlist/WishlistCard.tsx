"use client";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import DeleteWishlistButton from "@/app/components/products/DeleteWishlistButton";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

function WishlistCard(props:any) {
  const product = props.product || props.products || {};
  const productId = product.slug || props.productId;
  const image = product.variants[0]?.images?.[0] || props.img;
  const name = product.name || props.name;
  const price = product.price || props.price;
  const discount = product.discount || props.discount || 0;
  const brand = product.brand || props.brand;
  const fallback = '/assets/img/broken-image.jpg';
  return (
    <div className="relative border border-gray-200">
      <div>
        <Link href={`/products/${productId}`}>
          <Image
            className="max-w-full w-full h-auto object-cover"
            src={image}
            alt={name}
            width={400}
            height={400}
            onError={(e) => e.currentTarget.src = fallback}
          />
        </Link>
      </div>
      <div className="">
        <div className="">
          <div>
            <div className="px-2">
              <span className="capitalize text-[12px] text-gray-700">{brand}</span>
              <h3 className="text-[15px] md:text-[20px] font-semibold line-clamp-1">
                <Link href={`/products/${productId}`}>
                  {name}
                </Link>
              </h3>
            </div>
            <div className="flex gap-x-2 my-2 px-2">
              <p className="text-[12px] md:text-[15px] flex items-center">
                <CurrencyRupeeIcon sx={{ fontSize: "15px" }} />
                {price}
              </p>
              {discount > 0 && (
                <>
                  <p className="text-gray-400 text-[12px] md:text-[15px] line-through flex items-center">
                    <CurrencyRupeeIcon sx={{ fontSize: "15px" }} />
                    {parseInt(price * (discount / 100) + price)}
                  </p>
                  <p className="text-[12px] md:text-[14px] text-[#313647]">{discount}% OFF</p>
                </>
              )}
            </div>
            {/* <div className="mt-3">
              <AddCartsButton
                products={productId}
                productSize={product.sizes?.[0]?.label || "onesize"}
                productColor={product.colors?.[0]?.name || ""}
                btnStyle={{
                  color: '#ffffff',
                  backgroundColor: '#313647',
                  border: '0',
                  width: '100%',
                  fontSize: '14px',
                  textTransform: 'capitalize',
                  padding: '8px 16px',
                  borderRadius: '0',
                }}
              />
            </div> */}
          </div>
        </div>
      </div>
      <Box component="div" className="absolute top-[10px] right-[10px]">
        <DeleteWishlistButton wishlistItemId={props.wishlistItemId || props._id} />
      </Box>
    </div>
  );
}

export default WishlistCard;