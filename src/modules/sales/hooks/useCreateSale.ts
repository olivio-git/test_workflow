import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sale } from "../types/sale";
import { salesService } from "../services/salesService";

export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Sale) => salesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};
