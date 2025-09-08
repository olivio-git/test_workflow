import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSubcategory } from "../../types/subcategory.types";
import { subcategoriesService } from "../../services/subcategory.service";
import { SUBCATEGORY_QUERY_KEYS } from "../../constants/subcategoryQueryKeys";

type UpdateParams = {
    id: number;
    data: UpdateSubcategory;
};

export const useUpdateSubcategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateParams) => subcategoriesService.update(id, data),
        onSuccess: (updated, { id }) => {
            queryClient.invalidateQueries({ queryKey: SUBCATEGORY_QUERY_KEYS.lists() });
            queryClient.setQueryData(SUBCATEGORY_QUERY_KEYS.detail(id), updated);
        }
    });
};