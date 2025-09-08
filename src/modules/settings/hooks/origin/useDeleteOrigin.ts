import { useMutation, useQueryClient } from "@tanstack/react-query";
import { originsService } from "../../services/origin.service";
import { ORIGIN_QUERY_KEYS } from "../../constants/originQueryKeys";

export const useDeleteOrigin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => originsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORIGIN_QUERY_KEYS.lists() });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};