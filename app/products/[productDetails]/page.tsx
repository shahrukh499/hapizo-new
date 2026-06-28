"use client";
import dynamic from "next/dynamic";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  Rating,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import AddCartsButton from "@/app/components/products/AddCartsButton";
import Image from "next/image";
import DOMPurify from "dompurify";
import WishlistButton from "@/app/components/products/WishlistButton";
import { useQuery } from "@tanstack/react-query";
const ProductDetailsImages = dynamic(() => import("../ProductDetailsImages"), {
  loading: () => <div style={{ height: 500 }} />,
});
const DetailsTab = dynamic(() => import("@/app/components/DetailsTab"));
const ProductMoreDetails = dynamic(() => import("@/app/components/ProductMoreDetails"));

function ProductDetails() {
  // State management
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  // Get product slug from URL
  const params = useParams();
  const productUrl = params?.productDetails;

  // Data fetching
  const fetchProductDetails = async () => {
    const apiUri = getApiUrl(
      `${API_CONFIG.ENDPOINTS.PRODUCTDETAILS}/${productUrl}`
    );

    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.GET
    );

    const response = await fetch(apiUri, {
      ...requestOptions,
      next: { revalidate: 60 }, // 🔥 very important
    });
    const data = await response.json();

    if (data.status !== API_CONFIG.STATUS_CODES.SUCCESS) {
      throw new Error("Product not found");
    }

    return data;
  };

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<any, Error>({
    queryKey: ["product", productUrl],
    queryFn: fetchProductDetails,
    staleTime: 1000 * 60 * 5, // cache 5 min
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!products?.response) return;

    const firstVariant = products.response.variants?.[0];

    setColor(firstVariant?.color?.name || null);

    const firstVariantSizes = firstVariant?.sizes || [];

    if (
      firstVariantSizes.length === 1 &&
      firstVariantSizes[0].label?.toLowerCase().replace(/\s+/g, "") === "onesize"
    ) {
      setSize(firstVariantSizes[0].label);
    }
  }, [products]);

  const handleProdutsReview = async () => {
    const apiUri = getApiUrl(`${API_CONFIG.ENDPOINTS.REVIEW}/${productUrl}/reviews`);
    const requestOptions = API_CONFIG.createRequestOptions(
      API_CONFIG.HTTP_METHODS.GET
    );

    const response = await fetch(apiUri, {
      ...requestOptions,
      next: { revalidate: 60 },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    return data;
  };

  const { data: review, isLoading: revLoading } = useQuery({
    queryKey: ["reviewKey", productUrl],
    queryFn: handleProdutsReview,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Event handlers
  const handleSizeSelection = (event: React.MouseEvent<HTMLElement>, newSize: string | null) => {
    if (newSize !== null) {
      setSize(newSize);
    }
  };

  //button style
  const btnStyle = {
    color: '#ffffff',
    backgroundColor: '#313647',
    border: '0',
    width: '100%',
    display: 'flex',
    alignItems: 'start',
    gap: '5px',
    padding: '10px 10px',
    textTransform: 'capitalize'
  }

  const product = useMemo(() => products?.response, [products]);
  const variants = useMemo(() => product?.variants || [], [product]);
  const getColorValue = (variantColor: string | { name?: string; hex?: string; image?: string } | null | undefined) => {
    if (!variantColor) return null;
    if (typeof variantColor === "string") return variantColor;
    return variantColor.name || null;
  };

  const getColorBackground = (
    variantColor: string | { name?: string; hex?: string; image?: string } | null | undefined
  ) => {
    if (!variantColor) return "#fff";
    if (typeof variantColor === "string") return variantColor;
    return variantColor.image
      ? `url(${variantColor.image}) center/cover, ${variantColor.hex || "#fff"}`
      : variantColor.hex || "#fff";
  };

  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((variant: { color?: string | { name?: string; hex?: string; image?: string } | null }) => getColorValue(variant?.color) === color) || variants[0]
    );
  }, [variants, color]);
  const selectedColorValue = getColorValue(activeVariant?.color) || color;
  

  useEffect(() => {
    if (!activeVariant) {
      setSize(null);
      return;
    }

    const activeSizes = activeVariant.sizes || [];
    const hasSelectedSize = activeSizes.some((item: { label?: string }) => item.label === size);
    if (hasSelectedSize) return;

    if (
      activeSizes.length === 1 &&
      activeSizes[0].label &&
      activeSizes[0].label.replace(/\s+/g, "").toLowerCase() === "onesize"
    ) {
      setSize(activeSizes[0].label);
    } else {
      setSize(null);
    }
  }, [activeVariant, size]);

  // Helper functions
  const renderPriceSection = () => (
    <div className="flex items-center gap-x-2">
      <span className="text-[25px] font-semibold">
        ₹{activeVariant?.price || 0}
      </span>
      {product?.discount ? (
        <>
          <span className="text-gray-400 line-through">
            ₹
            {parseInt(
              activeVariant?.price * (product.discount / 100) + activeVariant?.price
            )}
          </span>
          <span className="bg-[#313647] text-[#ffffff] text-[13px] font-semibold pt-[3px] px-4 rounded-br-full">
            {product.discount}% OFF
          </span>
        </>
      ) : null}
    </div>
  );

  const sanitizedDescription = useMemo(() => {
    if (!product?.description) return "";
    return DOMPurify.sanitize(product.description);
  }, [product?.description]);

  const renderColorSelector = () => {
    if (!variants.length) return null;

    return (
      <div className="max-w-full">
        <p className="text-[15px] mb-2 uppercase font-semibold">More Colors</p>
        <div className="flex gap-2">
          {variants.map((variant: { _id?: string; color?: string | { name?: string; hex?: string; image?: string } | null | undefined }, idx: number) => (
            <div key={variant._id || idx} className="flex flex-col items-center">
              <Tooltip title={getColorValue(variant?.color) || "Color"} placement="top-start">
                <button
                  type="button"
                  onClick={() => setColor(getColorValue(variant?.color))}
                  style={{
                    outline: color === getColorValue(variant?.color) ? '2px solid #313647' : '1px solid #bdbdbd',
                    borderRadius: '5px',
                    width: 50,
                    height: 50,
                    background: getColorBackground(variant?.color),
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: color === getColorValue(variant?.color) ? '0 0 0 2px #313647' : 'none',
                  }}
                  aria-label={getColorValue(variant?.color) || "Color"}
                >
                  <span className="sr-only">{getColorValue(variant?.color) || "Color"}</span>
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSizeSelector = () => (
    <div className="max-w-full">
      <p className="text-[15px] mb-2 uppercase font-semibold">Select Size</p>
      <ToggleButtonGroup
        value={size}
        exclusive
        onChange={handleSizeSelection}
        aria-label="size selection"
        sx={{ display: 'block' }}
      >
        {(activeVariant?.sizes || []).map((ele: { label?: string; available?: boolean }, i: number) => (
          <ToggleButton
            key={i}
            value={ele.label || ''}
            aria-label={ele.label || ''}
            disabled={!ele.available}
            sx={{
              px: 3,
              py: 1,
              mr: 1,
              mb: 1,
              border: '1px solid',
              borderLeft: '1px solid #bdbdbd !important',
              borderColor: 'grey.400',
              borderRadius: 0,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: ele.available ? 'text.primary' : 'grey.500',
              '&.Mui-selected': {
                backgroundColor: '#313647',
                color: '#fff',
                borderRadius: '5px',
                '&:hover': {
                  backgroundColor: '#313647',
                },
              },
              '&:hover': {
                backgroundColor: 'grey.100',
              },
              '&.Mui-disabled': {
                borderColor: 'grey.300',
                cursor: 'not-allowed',
                borderRadius: '0px'
              },
            }}
          >
            {ele.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );

  const renderActionButtons = () => (
    <div className="max-w-full w-[500px] flex items-center gap-x-1">
      <AddCartsButton
        productId={product?._id}
        stock={activeVariant?.stock}
        productSize={size ?? ''}
        productColor={selectedColorValue ?? ''}
        btnStyle={btnStyle}
      />
      <WishlistButton productId={product?._id} />
    </div>
  );

  // Loading and error states
  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full lg:w-[50%] px-1.5">
              <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={1000} height={550} />
            </div>
            <div className="w-full lg:w-[50%] px-1.5">
              <Skeleton variant="text" sx={{ fontSize: '2rem', maxWidth: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: '30%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1.5rem', maxWidth: '20%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem', maxWidth: '100%' }} />
              <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth: '30%' }} />
              <div className="flex items-center w-full gap-x-1">
                <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={40} height={40} />
                <Skeleton variant="rectangular" sx={{ maxWidth: '100%' }} width={40} height={40} />
              </div>
              <div className="flex items-center w-full gap-x-1">
                <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth: '80%', width: '500px' }} />
                <Skeleton variant="text" sx={{ fontSize: '3rem', maxWidth: '100%', width: '50px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="h-[58vh] flex justify-center items-center flex-col">
            <Image src='/assets/img/bag.png' alt="bag" width={100} height={100} />
            <p className="mt-3">{error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (products?.status !== 0) {
    return (
      <section className="pt-6">
        <div className="container mx-auto px-2 md:px-12">
          <div className="h-[58vh] flex justify-center items-center flex-col">
            <Image src='/assets/img/bag.png' alt="bag" width={100} height={100} />
            <p className="mt-3">
              {typeof error === "object" && error !== null && "message" in error
                ? (error as any).message
                : "Something went wrong"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="py-6">
      <div className="container mx-auto px-2 md:px-12">
        <div className="flex flex-wrap gap-y-3">
          {/* Product Images */}
          <div className="w-full lg:w-[60%] xl:w-[50%] md:px-1.5">
            <ProductDetailsImages
              productName={product?.name}
              images={activeVariant?.images || []}
            />
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-[40%] xl:w-[50%] md:px-1.5 flex flex-col gap-y-2">
            <div>
              <span className="text-[13px] bg-[#313647] text-[#ffffff] font-semibold pt-1.5 pb-1 px-3 rounded-r-full uppercase">
                {products?.response.brand}
              </span>
            </div>
            <div>
              <h1 className="text-[25px] lg:text-[30px] font-bold leading-tight">
                {products?.response.name}
              </h1>
            </div>
            {
              review?.reviews?.length > 0 && (
                <div className="flex items-center gap-x-2">
                  {
                    revLoading ? (
                      <p>Loading...</p>
                    ) : (
                      <Rating
                        name="half-rating-read"
                        value={review?.ratingSummary?.averageRating || 0}
                        precision={0.5}
                        size="small"
                        readOnly
                      />
                    )
                  }
                  <small className="text-gray-500">{review?.ratingSummary?.totalReviews} reviews</small>
                </div>
              )
            }

            <div className="max-w-full w-[500px]">
              <p className="text-[15px] mb-2 uppercase font-semibold">Product Details</p>
              <div
                className="text-[15px] text-gray-500 line-clamp-1 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              />
              <ProductMoreDetails
                title={products?.response?.name}
                bodyHtml={sanitizedDescription}
              />
            </div>

            <div>
              {renderPriceSection()}
              <p className="text-[#ff7520] font-bold">inclusive of all taxes</p>
            </div>
            <div>
              {renderColorSelector()}
            </div>
            <div>
              {renderSizeSelector()}
            </div>
            <div>
              {renderActionButtons()}
            </div>
          </div>
        </div>
        <div className="pt-6">
          <DetailsTab
            features={products?.response?.features}
            bodyHtml={sanitizedDescription}
            review={review}
          />
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
