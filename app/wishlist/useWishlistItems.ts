import { useQuery } from "@tanstack/react-query";
import { API_CONFIG, getApiUrl } from "@/app/utils/apiConfig";

const fetchWishlist = async () => {
  const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.WISHLIST);
  const requestOptions = API_CONFIG.createRequestOptions(
    API_CONFIG.HTTP_METHODS.GET
  );

  const response = await fetch(apiUri, requestOptions);
  const data = await response.json();

  // Check if response has wishlist array (success case)
  if (data.wishlist && Array.isArray(data.wishlist)) {
    return data;
  }
  
  // Check for status code if present
  if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
    return data;
  }
  
  // If neither condition is met, throw error
  throw new Error(data.message || "Failed to fetch wishlist");
};

export function useWishlistItems(user : string) {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: !!user,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 10,
  });
}

