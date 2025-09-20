import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateOrigin } from "../../types/origin.types";
import { originsService } from "../../services/origin.service";
import { ORIGIN_QUERY_KEYS } from "../../constants/originQueryKeys";

export const useCreateOrigin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateOrigin) => originsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORIGIN_QUERY_KEYS.lists() });
        }
    });
};
