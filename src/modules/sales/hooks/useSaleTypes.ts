import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSaleTypes } from "../services/salesCommonsService";

export const useSaleTypes = () => {
    return useQuery({
        queryKey: ["sale-types"],
        queryFn: async () => await fetchSaleTypes(),
        placeholderData: keepPreviousData,
        staleTime: Infinity
    });
};
