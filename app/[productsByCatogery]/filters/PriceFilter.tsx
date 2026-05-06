"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useRouter, useSearchParams } from "next/navigation";

const valuetext = (value: number) => {
    return `${value}`;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function RangeSlider() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isMounted, setIsMounted] = React.useState(false);
    const [hasUserInteracted, setHasUserInteracted] = React.useState(false);

    // Get initial values from URL or fallback to [0, 5000]
    const [initialMin, initialMax] = React.useMemo(() => {
        return [
          Number(searchParams.get("minPrice")) || 0,
          Number(searchParams.get("maxPrice")) || 5000,
        ];
      }, [searchParams]);

    const [value, setValue] = React.useState<number[]>([initialMin, initialMax]);

    // Debounce the value with 500ms delay
    const debouncedValue = useDebounce(value, 500);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    // Update URL when debounced value changes, but only if user has interacted
    React.useEffect(() => {
        if (isMounted && hasUserInteracted) {
          const currentMin = searchParams.get("minPrice");
          const currentMax = searchParams.get("maxPrice");
      
          if (
            currentMin === String(debouncedValue[0]) &&
            currentMax === String(debouncedValue[1])
          ) {
            return; // 🚀 skip unnecessary push
          }
      
          const params = new URLSearchParams(searchParams.toString());
          params.set("minPrice", String(debouncedValue[0]));
          params.set("maxPrice", String(debouncedValue[1]));
      
          router.push(`?${params.toString()}`);
        }
      }, [debouncedValue, isMounted, hasUserInteracted, router, searchParams]);

    const handleChange = React.useCallback(
        (event: Event, newValue: number | number[]) => {
          setValue(newValue as number[]);
          setHasUserInteracted(true);
        },
        []
      );

    return (
        <Box sx={{ maxWidth: "100%", width: 220, mt: "10px" }}>
            <h3 className="text-[15px] font-semibold">Price Range</h3>
            {!isMounted ? (
                <p>Loading...</p>
            ) : (
                <Slider
                    getAriaLabel={() => "Price range"}
                    value={value}
                    min={0}
                    max={5000}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                />
            )}
        </Box>
    );
}
