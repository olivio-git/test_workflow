import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { quotationService } from "../services/quotation.service";

export const useQuotationGetById = (id: number) => {
    return useQuery({
        queryKey: ["quotation-detail", id],
        queryFn: async () => await quotationService.getById(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!id
    });
};
