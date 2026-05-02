// src/hooks/useNavbarData.js
"use client";
import { useQuery } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";

const handleNavbar = async () => {
  const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.NAVBAR);
  const requestOptions = API_CONFIG.createRequestOptions(
    API_CONFIG.HTTP_METHODS.GET
  );

  const response = await fetch(apiUri, requestOptions);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch navbar data");
  }

  return data;
};

// ✅ Custom React Query hook
export function useNavbarData() {
  return useQuery({
    queryKey: ["navbar"],
    queryFn: handleNavbar,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
}
