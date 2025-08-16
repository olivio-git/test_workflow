import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { cleanUndefined } from "@/utils/zodHelpers";
import type { SalesFilters } from "../types/salesFilters";
import { salesFiltersSchema } from "../schemas/salesFilters.schema";
import { fetchSales } from "../services/salesService";

export const useSalesPaginated = (filters: SalesFilters) => {
    const parsed = salesFiltersSchema.safeParse(filters);
    const parsedFilters = parsed.success ? cleanUndefined(parsed.data) : {};
    return useQuery({
        queryKey: ["sales", parsedFilters],
        queryFn: async () => await fetchSales(parsedFilters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!parsedFilters?.sucursal,
    });
};
