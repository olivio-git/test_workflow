import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateBrand } from "../../types/brand.types";
import { brandsService } from "../../services/brand.service";
import { BRAND_QUERY_KEYS } from "../../constants/brandQueryKeys";

export const useCreateBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBrand) => brandsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRAND_QUERY_KEYS.lists() });
        }
    });
};
