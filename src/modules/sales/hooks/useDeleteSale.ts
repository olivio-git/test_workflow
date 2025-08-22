import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSale } from "../services/salesService";

export const useDeleteSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (idSale: number) => deleteSale(idSale),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};
