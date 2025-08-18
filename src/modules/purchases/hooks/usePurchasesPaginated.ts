import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPurchases } from "../services/purchaseService";
import type { PurchaseFilters } from "../types/purchaseFilters";

export const usePurchasesPaginated = (filters: PurchaseFilters) => {
    return useQuery({
        queryKey: ["purchases", filters],
        queryFn: async () => await fetchPurchases(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!filters?.sucursal,
    });
};
