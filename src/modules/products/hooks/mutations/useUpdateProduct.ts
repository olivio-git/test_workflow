import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductUpdate } from "../../types/ProductUpdate.types";
import { productsService } from "../../services/productService";

type UpdateProductParams = {
    id: number;
    data: ProductUpdate;
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateProductParams) => productsService.update(id, data),
        onSuccess: (updatedProduct, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.setQueryData(["product-detail", id], updatedProduct);
            // queryClient.invalidateQueries({ queryKey: ["product-detail", id] });

        }
    });
};
