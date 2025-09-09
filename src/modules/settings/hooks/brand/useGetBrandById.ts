import { useQuery } from "@tanstack/react-query";
import { brandsService } from "../../services/brand.service";
import { BRAND_QUERY_KEYS } from "../../constants/brandQueryKeys";

export const useGetBrandById = (id: number) => {
    return useQuery({
        queryKey: BRAND_QUERY_KEYS.detail(id),
        queryFn: async () => await brandsService.getById(id),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};