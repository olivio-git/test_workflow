import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { SalesParams } from "../types/productDetailParams";
import { productsService } from "../services/productService";

export const useProductSalesStats = (params: SalesParams) => {
    // const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["product-sales-stats", params],
        queryFn: async () => await productsService.getSalesStats(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!params.producto
            && !!params.sucursal
            && !!params.gestion_1
            && !!params.gestion_2,
    });
};
