import { useQuery } from "@tanstack/react-query";
import { SUBCATEGORY_QUERY_KEYS } from "../../constants/subcategoryQueryKeys";
import { subcategoriesService } from "../../services/subcategory.service";

export const useGetSubcategoryById = (id: number) => {
    return useQuery({
        queryKey: SUBCATEGORY_QUERY_KEYS.detail(id),
        queryFn: async () => await subcategoriesService.getById(id),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};