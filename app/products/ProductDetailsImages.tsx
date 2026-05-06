"use client"
import React, { useEffect, useRef } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';

type ProductDetailsImagesProps = {
    productName?: string;
    images?: string[];
}

function ProductDetailsImages(props: ProductDetailsImagesProps) {

    const mainRef = useRef<any | null>(null);
    const thumbsRef = useRef<any | null>(null);

    const { productName, images = [] } = props


    const mainOptions = {
        arrows: false,
        type: 'loop',
        perPage: 1,
        perMove: 1,
        pagination: false,
        height: '39.8125rem',
        breakpoints: {
            767: {
                height: '100%',
            }
        }
    };

    const thumbsOptions = {
        arrows: false,
        direction: 'ttb', // vertical direction
        height: '39.8125rem',
        fixedWidth: 80,
        fixedHeight: 80,
        gap: '.2rem',
        isNavigation: true,
        pagination: false,
        cover: true,
        breakpoints: {
            767: {
                direction: 'ltr',
                height: '100%'
            }
        }
    };

    useEffect(() => {
        if (!mainRef.current || !thumbsRef.current?.splide) return;

        // Keep main and thumbnail sliders linked after variant image updates.
        mainRef.current.sync(thumbsRef.current.splide);
        mainRef.current.go(0);
    }, [images]);
    return (
        <div className='flex flex-col-reverse md:flex-row gap-1 max-w-full w-[620px]'>
            {/* Thumbnail Navigation Slider */}
            <Splide
                options={thumbsOptions}
                ref={thumbsRef}
                aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
            >
                {images.map((slide, i) => {
                    const altText = `${productName || "product"} image ${i + 1}`;
                    return (
                        <SplideSlide key={`${slide}-${i}`}>
                            <Image src={slide} alt={altText} width={500} height={500} />
                        </SplideSlide>
                    );
                })}
            </Splide>
            {/* Main Product Slider */}
            <Splide
                options={mainOptions}
                ref={mainRef}
                aria-labelledby="thumbnail-slider-example"
            >
                {images.map((slide, i) => {
                    const altText = `${productName || "product"} image ${i + 1}`;
                    return (
                        <SplideSlide key={`${slide}-${i}`}>
                            <Image src={slide} alt={altText} width={540} height={720} />
                        </SplideSlide>
                    );
                })}
            </Splide>

        </div>
    )
}

export default ProductDetailsImages