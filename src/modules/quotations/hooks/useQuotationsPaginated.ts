import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { cleanUndefined } from "@/utils/zodHelpers";
import type { QuotationFilters } from "../types/quotationFilters.types";
import { salesFiltersSchema } from "@/modules/sales/schemas/salesFilters.schema";
import { fetchQuotations } from "../services/quotation.service";

export const useQuotationsPaginated = (filters: QuotationFilters) => {
    const parsed = salesFiltersSchema.safeParse(filters);
    const parsedFilters = parsed.success ? cleanUndefined(parsed.data) : {};

    const bothOrNoneDates =
        (!!parsedFilters.fecha_inicio && !!parsedFilters.fecha_fin) ||
        (!parsedFilters.fecha_inicio && !parsedFilters.fecha_fin);

    return useQuery({
        queryKey: ["quotations", parsedFilters],
        queryFn: async () => await fetchQuotations(parsedFilters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!parsedFilters?.sucursal && bothOrNoneDates,
    });
};
