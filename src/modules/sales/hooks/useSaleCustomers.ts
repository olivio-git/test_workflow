import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSaleCustomers } from "../services/salesCommonsService";

export const useSaleCustomers = (cliente?: string) => {
    return useQuery({
        queryKey: ["sale-customers", cliente],
        queryFn: async () => await fetchSaleCustomers(cliente),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15, // 15 minutes
    });
};
