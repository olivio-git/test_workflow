import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCategory } from "../../types/category.types";
import { categoriesService } from "../../services/category.service";
import { CATEGORY_QUERY_KEYS } from "../../constants/categoryQueryKeys";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCategory) => categoriesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
        }
    });
};