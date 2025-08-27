import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

export const useCategoriesWithSubcategories = (nombreCategoria?: string) => {
    return useQuery({
        queryKey: ["catalog", "categories-with-subcategories", nombreCategoria],
        queryFn: async () => await commonService.getCategoriesWithSubcategories(nombreCategoria),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    });
};
