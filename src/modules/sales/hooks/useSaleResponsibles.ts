import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { saleCommonsService } from "../services/salesCommonsService";

export const useSaleResponsibles = () => {
    return useQuery({
        queryKey: ["sale-responsibles"],
        queryFn: async () => await saleCommonsService.getSaleResponsibles(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15
    });
};
