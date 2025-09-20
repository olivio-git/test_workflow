import type { BrandFilters } from "../types/brand.types";

export const BRAND_QUERY_KEYS = {
    all: ["brands"] as const,
    lists: () => [...BRAND_QUERY_KEYS.all, "list"] as const,
    list: (filters?: BrandFilters) =>
        [...BRAND_QUERY_KEYS.lists(), { filters }] as const,

    details: () => [...BRAND_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string | number) =>
        [...BRAND_QUERY_KEYS.details(), id] as const,
};  