import { API_CONFIG, getApiUrl } from "../utils/apiConfig";

type AddToCartPayload = {
    productId: string;
    productSize: string;
    productColor: string;
    quantity: number;
};


export const addToCart = async (productId: string, productSize: string, productColor: string, quantity: number, enqueueSnackbar: any) => {
    const payload: AddToCartPayload = {
        productId,
        quantity,
        productSize,
        productColor,
    };
    try {
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDTOCART);
        const requestOptions = API_CONFIG.createRequestOptions(
            API_CONFIG.HTTP_METHODS.POST,
            payload as any
        );

        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();
        if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
            enqueueSnackbar(data.message, { variant: "success" });
            return data;
        } else {
            enqueueSnackbar(data.message, { variant: "error" });
        }
    } catch (e) {
        console.error("Error adding item to cart:", e);
    }
};

export const fetchCartItems = async () => {
    const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ADDTOCART); // should be GET /cart
    const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.GET
    );

    const response = await fetch(apiUri, requestOptions);
    const data = await response.json();

    if (data.status === API_CONFIG.STATUS_CODES.SUCCESS) {
        return data; // return cart data
    } else {
        throw new Error(data.message || "Failed to fetch cart");
    }
};
