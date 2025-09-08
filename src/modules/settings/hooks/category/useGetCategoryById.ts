import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { CATEGORY_QUERY_KEYS } from "../../constants/categoryQueryKeys";
import { categoriesService } from "../../services/category.service";

export const useGetCategoryById = (id: number) => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.detail(id),
        queryFn: async () => await categoriesService.getById(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};