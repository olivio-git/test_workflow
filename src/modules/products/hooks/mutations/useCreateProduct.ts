import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductCreate } from "../../types/ProductCreate.types";
import { productsService } from "../../services/productService";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProductCreate) => productsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        }
    });
};
