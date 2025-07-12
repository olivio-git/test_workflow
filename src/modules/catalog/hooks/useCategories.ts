import { useQuery } from "@tanstack/react-query";
import { fetchCategoriesWithSubcategories } from "../services/catalogService";

export const useCategoriesWithSubcategories = (nombreCategoria?: string) => {
    return useQuery({
        queryKey: ["catalog", "categories-with-subcategories", nombreCategoria],
        queryFn: () => fetchCategoriesWithSubcategories(nombreCategoria),
    });
};
