"use client";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

type FilterType = "category";

type SelectedFilters = {
  category: string[];
};

const filterOptions = {
  category: [
    { value: "tshirt", label: "T-Shirt" },
    { value: "shoes", label: "Shoes" },
  ],
};

function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: searchParams.get("category")?.split(",") || [],
  });

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
    <div className="mt-4">
      <h3 className="text-[15px] font-semibold">Category</h3>
      <FormGroup>
        {filterOptions.category.map((option) => (
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
        ))}
      </FormGroup>
    </div>
  );
}

export default CategoryFilter;
