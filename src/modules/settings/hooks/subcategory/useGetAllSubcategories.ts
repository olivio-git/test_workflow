import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { SubcategoryFilters } from "../../types/subcategory.types";
import { SUBCATEGORY_QUERY_KEYS } from "../../constants/subcategoryQueryKeys";
import { subcategoriesService } from "../../services/subcategory.service";

export const useGetAllSubcategories = (filters: SubcategoryFilters) => {

    return useQuery({
        queryKey: SUBCATEGORY_QUERY_KEYS.list(filters),
        queryFn: async () => await subcategoriesService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};