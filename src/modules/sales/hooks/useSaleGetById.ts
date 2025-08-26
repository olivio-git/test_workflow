import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { salesService } from "../services/salesService";

export const useSaleGetById = (id: number) => {
    return useQuery({
        queryKey: ["sale-detail", id],
        queryFn: async () => await salesService.getById(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id
    });
};
