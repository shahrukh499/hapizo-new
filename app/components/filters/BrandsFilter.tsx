"use client";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { capitalize, Checkbox, FormControlLabel, FormGroup, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type FilterType = "brand";

type SelectedFilters = {
    brand: string[];
};

type brandListType = {
    value: string;
    label: string;
}

function BrandsFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
        brand: searchParams.get("brand")?.split(",") || [],
    });

    const {
        data: brandLst,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["branList"],
        queryFn: async () => {
            const apiUri = getApiUrl(
                `${API_CONFIG.ENDPOINTS.BrandList}`
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
                throw new Error("Category not found");
            }

            return data;
        },
        enabled: !!searchParams.toString(), // only run when params exist
        staleTime: 1000 * 60 * 5
    });

    //console.log(brandLst,"brand")

    const handleFilterChange = (filterType: FilterType, value: string) => {
        const newFilters = { ...selectedFilters };

        if (newFilters[filterType].includes(value)) {
            newFilters[filterType] = newFilters[filterType].filter(
                (item) => item !== value
            );
        } else {
            newFilters[filterType] = [...newFilters[filterType], value];
        }

        setSelectedFilters(newFilters);

        // Merge with existing params
        const params = new URLSearchParams(searchParams.toString());
        if (newFilters[filterType].length > 0) {
            params.set(filterType, newFilters[filterType].join(","));
        } else {
            params.delete(filterType);
        }

        router.push(`?${params.toString()}`);
    };

    return (
        <div>
            <h3 className="text-[15px] font-semibold">Brands</h3>
            <FormGroup>
                {
                    isLoading ? (
                        <div>
                            <Skeleton variant="text" sx={{ width: "90%", mb: 1 }} />
                            <Skeleton variant="text" sx={{ width: "90%", mb: 1 }} />
                        </div>
                    ) : (
                        brandLst?.brands?.map((option: brandListType) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        checked={selectedFilters.brand.includes(option.value)}
                                        onChange={() => handleFilterChange("brand", option.value)}
                                        size="small"
                                    />
                                }
                                label={option.label}
                                sx={{ textTransform: "capitalize" }}
                            />
                        ))
                    )}
            </FormGroup>
        </div>
    );
}

export default BrandsFilter;
