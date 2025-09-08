import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { CategoryFilters } from "../../types/category.types";
import { CATEGORY_QUERY_KEYS } from "../../constants/categoryQueryKeys";
import { categoriesService } from "../../services/category.service";

export const useGetAllCategories = (filters: CategoryFilters) => {

    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.list(filters),
        queryFn: async () => await categoriesService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};