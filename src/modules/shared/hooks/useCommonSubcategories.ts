import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

interface UseCommonSubcategoriesProps {
    subcategoria?: string,
    categoria?: number
    enabled?: boolean
}

export const useCommonSubcategories = ({
    categoria,
    subcategoria,
    enabled = true,
}: UseCommonSubcategoriesProps) => {
    return useQuery({
        queryKey: ["shared", "common-subcategories", subcategoria, categoria],
        queryFn: async () => await commonService.getSubcategories(subcategoria, categoria),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15, // 15 minutes
        retry: 1,
        enabled: enabled
    });
};
