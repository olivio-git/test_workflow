import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { saleCommonsService } from "../services/salesCommonsService";

export const useSaleCustomers = (cliente?: string) => {
    return useQuery({
        queryKey: ["sale-customers", cliente],
        queryFn: async () => await saleCommonsService.getSaleCustomers(cliente),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });
};
