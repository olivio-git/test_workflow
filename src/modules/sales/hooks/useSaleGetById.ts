import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSaleDetail } from "../services/salesService";

export const useSaleGetById = (id: number) => {
    return useQuery({
        queryKey: ["sale-detail", id],
        queryFn: async () => await fetchSaleDetail(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id
    });
};
