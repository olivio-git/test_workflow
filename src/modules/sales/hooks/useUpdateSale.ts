import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaleUpdate } from "../types/saleUpdate.type";
import { salesService } from "../services/salesService";

type UpdateSaleParams = {
    saleId: number;
    data: SaleUpdate;
};

export const useUpdateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ saleId, data }: UpdateSaleParams) => salesService.update(saleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};
