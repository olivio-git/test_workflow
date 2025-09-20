import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { BrandFilters } from "../../types/brand.types";
import { BRAND_QUERY_KEYS } from "../../constants/brandQueryKeys";
import { brandsService } from "../../services/brand.service";

export const useGetAllBrands = (filters: BrandFilters) => {

    return useQuery({
        queryKey: BRAND_QUERY_KEYS.list(filters),
        queryFn: () => brandsService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};