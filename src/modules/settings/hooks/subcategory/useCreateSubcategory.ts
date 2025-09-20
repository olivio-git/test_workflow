import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSubcategory } from "../../types/subcategory.types";
import { subcategoriesService } from "../../services/subcategory.service";
import { SUBCATEGORY_QUERY_KEYS } from "../../constants/subcategoryQueryKeys";

export const useCreateSubcategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSubcategory) => subcategoriesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUBCATEGORY_QUERY_KEYS.lists() });
        }
    });
};