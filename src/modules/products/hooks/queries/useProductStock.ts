import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { StockParams } from "../../types/productDetailParams";
import { productsService } from "../../services/productService";

export const useProductStock = (params: StockParams) => {
    // const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["product-stock", params],
        queryFn: async () => await productsService.getStock(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!params.producto && !!params.sucursal
    });
};
