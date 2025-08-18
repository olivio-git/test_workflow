import { useQuery } from "@tanstack/react-query";
import { fetchPurchaseById } from "../services/purchaseService";

export const usePurchaseById = (id: number) => {
    return useQuery({
        queryKey: ["purchase", id],
        queryFn: () => fetchPurchaseById(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id,
    });
};
