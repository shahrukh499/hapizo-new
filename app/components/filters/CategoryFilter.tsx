"use client";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";
import { Checkbox, FormControlLabel, FormGroup, Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type FilterType = "category";

type SelectedFilters = {
  category: string[];
};

type categorylistType = {
  value : string;
  label : string;
}


function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: searchParams.get("category")?.split(",") || [],
  });

  const {
    data: CategoryList,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["CategoryList"],
    queryFn: async () =>{
      const apiUri = getApiUrl(
        `${API_CONFIG.ENDPOINTS.CategoryList}`
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

  //console.log(CategoryList,"CategoryList")

  const handleFilterChange = (filterType : FilterType, value : string) => {
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
      <h3 className="text-[15px] font-semibold">Category</h3>
      <FormGroup>
        {
        isLoading ? (
          <div>
            <Skeleton variant="text" sx={{width:"90%", mb:1}} />
            <Skeleton variant="text" sx={{width:"90%", mb:1}} />
          </div>
        ) : (
          CategoryList?.categories?.map((option : categorylistType) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedFilters.category.includes(option.value)}
                  onChange={() => handleFilterChange("category", option.value)}
                  size="small"
                />
              }
              label={option.label}
            />
          ))
        )}
      </FormGroup>
    </div>
  );
}

export default CategoryFilter;
