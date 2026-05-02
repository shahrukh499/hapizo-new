import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "./cartApi";

interface addToCartPropsType{
    productId: string;
    size: string;
    colour: string;
    quantity: number;
    enqueueSnackbar: any
}


export function useAddToCart() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, size, colour, quantity, enqueueSnackbar } : addToCartPropsType) =>
            addToCart(productId, size, colour, quantity, enqueueSnackbar),
        onSuccess: () => {
            // Refresh cart everywhere
            queryClient.invalidateQueries({ queryKey: ["cartItems"] });
        },
        onError: (error) => {
            console.error("Add to cart failed:", error.message);
        },
    });
}