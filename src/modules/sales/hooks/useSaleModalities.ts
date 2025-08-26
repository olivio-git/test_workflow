import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { saleCommonsService } from "../services/salesCommonsService";

export const useSaleModalities = () => {
    return useQuery({
        queryKey: ["sale-modalities"],
        queryFn: async () => await saleCommonsService.getSaleModalities(),
        placeholderData: keepPreviousData,
        staleTime: Infinity
    });
};
