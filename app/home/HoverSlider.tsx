"use client"
import React, { useRef } from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Image from 'next/image';
import Link from 'next/link';

interface hoverPropsType{
  thumbnails: [] | null;
  slug: string;
  eagerLoad: boolean
}

function HoverSlider({ thumbnails, slug, eagerLoad = false } : hoverPropsType) {
    const splideRef = useRef<any>(null);
  
    const play = () => {
      const splide = splideRef.current?.splide;
      splide?.Components?.Autoplay?.play();
    };
  
    const pause = () => {
      const splide = splideRef.current?.splide;
      splide?.Components?.Autoplay?.pause();
    };
  return (
    <div className='itemCard' onMouseEnter={play} onMouseLeave={pause}>
        <Splide
          ref={splideRef}
          options={{
            rewind: true,
            gap: "1rem",
            arrows: false,
            pagination: true,
            autoplay: false,
            interval: 2000,
          }}
        >
          {thumbnails?.map((img:string, i:number) => (
            <SplideSlide key={i}>
              <Link href={`products/${slug}`} prefetch>
                <Image
                  className="w-full h-auto lg:rounded"
                  src={img}
                  alt="list"
                  height={400}
                  width={500}
                  loading={eagerLoad && i === 0 ? "eager" : "lazy"}
                  priority={eagerLoad && i === 0}
                />
              </Link>
            </SplideSlide>
          ))}
        </Splide>
      </div>
  )
}

export default HoverSlider