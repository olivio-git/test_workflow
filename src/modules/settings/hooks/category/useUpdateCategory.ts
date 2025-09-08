import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCategory } from "../../types/category.types";
import { categoriesService } from "../../services/category.service";
import { CATEGORY_QUERY_KEYS } from "../../constants/categoryQueryKeys";

type UpdateParams = {
    id: number;
    data: UpdateCategory;
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateParams) => categoriesService.update(id, data),
        onSuccess: (updated, { id }) => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
            queryClient.setQueryData(CATEGORY_QUERY_KEYS.detail(id), updated);
        }
    });
};