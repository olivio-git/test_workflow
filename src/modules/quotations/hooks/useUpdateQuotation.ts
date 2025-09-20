import { useMutation, useQueryClient } from "@tanstack/react-query";
import { quotationService } from "../services/quotation.service";
import type { QuotationUpdate } from "../types/quotationUpdate.types";

type UpdateQuotationParams = {
    quotationId: number;
    data: QuotationUpdate;
};

export const useUpdateQuotation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ quotationId, data }: UpdateQuotationParams) => quotationService.update(quotationId, data),
        onSuccess: (updatedQuotation, { quotationId }) => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.setQueryData(["quotation-detail", quotationId], updatedQuotation);
            // queryClient.invalidateQueries({ queryKey: ["quotation-detail", quotationId] });

        }
    });
};
