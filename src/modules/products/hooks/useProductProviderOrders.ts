import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ProvOrdersParams } from "../types/productDetailParams";
import { fetchProductProviderOrders } from "../services/productService";

export const useProductProviderOrders = (params: ProvOrdersParams) => {
    // const isAuthenticated = authSDK.isAuthenticated();
    return useQuery({
        queryKey: ["product-provider-orders", params],
        queryFn: async () => await fetchProductProviderOrders(params),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!params.producto && !!params.sucursal
    });
};
