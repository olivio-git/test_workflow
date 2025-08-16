import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "../services/productService";
import type { ProductFilters } from "../types/productFilters";
import { cleanUndefined } from "@/utils/zodHelpers";
import { productFiltersSchema } from "../schemas/productFilter.schema";

export const useProductsPaginated = (filters: ProductFilters) => {
    const parsed = productFiltersSchema.safeParse(filters);
    const parsedFilters = parsed.success ? cleanUndefined(parsed.data) : {};
    return useQuery({
        queryKey: ["products", parsedFilters],
        queryFn: async () => await fetchProducts(parsedFilters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        enabled: !!parsedFilters?.sucursal,
    });
};
