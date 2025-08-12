import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSaleResponsibles } from "../services/salesCommonsService";

export const useSaleResponsibles = () => {
    return useQuery({
        queryKey: ["sale-responsibles"],
        queryFn: async () => await fetchSaleResponsibles(),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15
    });
};
