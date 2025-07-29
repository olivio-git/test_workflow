import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSaleModalities } from "../services/salesCommonsService";

export const useSaleModalities = () => {
    return useQuery({
        queryKey: ["sale-modalities"],
        queryFn: async () => await fetchSaleModalities(),
        placeholderData: keepPreviousData,
        staleTime: Infinity
    });
};
