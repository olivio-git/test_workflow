import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSale } from "../services/salesService";
import type { Sale } from "../types/sale";
import { toast } from "@/hooks/use-toast";

export const useCreateSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Sale) => postSale(data),
        onSuccess: (response) => {
            toast({
                title: "Venta Existosa",
                description: response.message ?? "Venta registrada correctamente",
                className: "border border-gray-200"
            });

            // 🔄 Invalida queries relevantes
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            console.log(error)
            const message =
                error.message ??
                "Ocurrió un error inesperado al registrar la venta";
            toast({
                title: "Ha ocurrido un error",
                description: message,
                className: "border border-gray-200"
            });
        },
    });
};
