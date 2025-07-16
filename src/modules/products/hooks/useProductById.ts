import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProductDetail } from "../services/productService";

export const useProductById = (id: number) => {
    // const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["product-detail", id],
        queryFn: async () => await fetchProductDetail(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id
    });
};
