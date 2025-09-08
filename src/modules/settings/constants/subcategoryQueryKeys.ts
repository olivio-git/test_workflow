import type { SubcategoryFilters } from "../types/subcategory.types";

export const SUBCATEGORY_QUERY_KEYS = {
    all: ["subcategories"] as const,
    lists: () => [...SUBCATEGORY_QUERY_KEYS.all, "list"] as const,
    list: (filters?: SubcategoryFilters) =>
        [...SUBCATEGORY_QUERY_KEYS.lists(), { filters }] as const,

    details: () => [...SUBCATEGORY_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string | number) =>
        [...SUBCATEGORY_QUERY_KEYS.details(), id] as const,
};
