import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ProductFilters } from "../../types/productFilters";
import { cleanUndefined } from "@/utils/zodHelpers";
import { productFiltersSchema } from "../../schemas/productFilter.schema";
import { productsService } from "../../services/productService";

export const useProductsPaginated = (filters: ProductFilters) => {
    const parsed = productFiltersSchema.safeParse(filters);
    const parsedFilters = parsed.success ? cleanUndefined(parsed.data) : {};
    return useQuery({
        queryKey: ["products", parsedFilters],
        queryFn: async () => await productsService.getAll(parsedFilters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!parsedFilters?.sucursal,
    });
};
