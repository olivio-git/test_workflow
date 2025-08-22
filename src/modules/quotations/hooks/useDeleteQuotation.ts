import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteQuotation } from "../services/quotation.service";

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (idQuotation: number) => deleteQuotation(idQuotation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};
