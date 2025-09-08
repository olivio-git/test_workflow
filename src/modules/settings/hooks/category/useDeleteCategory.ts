import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesService } from "../../services/category.service";
import { CATEGORY_QUERY_KEYS } from "../../constants/categoryQueryKeys";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => categoriesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.lists() });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};