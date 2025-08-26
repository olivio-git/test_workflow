import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsService } from "../services/productService";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: number) => productsService.delete(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};
