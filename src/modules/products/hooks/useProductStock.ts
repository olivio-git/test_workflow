import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProductStock } from "../services/productService";
import type { StockParams } from "../types/productDetailParams";

export const useProductStock = (params: StockParams) => {
    // const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["product-stock", params],
        queryFn: async () => await fetchProductStock(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!params.producto && !!params.sucursal
    });
};
