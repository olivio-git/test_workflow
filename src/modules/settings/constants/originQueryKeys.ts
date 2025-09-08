import type { OriginFilters } from "../types/origin.types";

export const ORIGIN_QUERY_KEYS = {
    all: ["origins"] as const,
    lists: () => [...ORIGIN_QUERY_KEYS.all, "list"] as const,
    list: (filters?: OriginFilters) =>
        [...ORIGIN_QUERY_KEYS.lists(), { filters }] as const,

    details: () => [...ORIGIN_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string | number) =>
        [...ORIGIN_QUERY_KEYS.details(), id] as const,
};  