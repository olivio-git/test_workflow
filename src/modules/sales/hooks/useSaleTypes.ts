import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { saleCommonsService } from "../services/salesCommonsService";

export const useSaleTypes = () => {
    return useQuery({
        queryKey: ["sale-types"],
        queryFn: async () => await saleCommonsService.getSaleTypes(),
        placeholderData: keepPreviousData,
        staleTime: Infinity
    });
};
