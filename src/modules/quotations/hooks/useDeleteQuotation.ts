import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "../services/quotation.service";

export const useDeleteQuotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (idQuotation: number) => quotationService.delete(idQuotation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};
