import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSale } from "../services/salesService";
import type { Sale } from "../types/sale";

export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Sale) => postSale(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};
