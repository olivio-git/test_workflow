import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "../services/productService";
import type { ProductFilters } from "../types/productFilters";
import authSDK from "@/services/sdk-simple-auth";

export const useProductsPaginated = (filters: ProductFilters) => {
    const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => await fetchProducts(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: isAuthenticated || !!filters?.sucursal,
    });
};
