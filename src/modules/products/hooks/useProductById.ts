import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { productsService } from "../services/productService";

export const useProductById = (id: number) => {
    return useQuery({
        queryKey: ["product-detail", id],
        queryFn: async () => await productsService.getById(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id
    });
};
