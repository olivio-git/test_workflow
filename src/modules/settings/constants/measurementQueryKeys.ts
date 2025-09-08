import type { MeasurementFilters } from "../types/measurement.types";

export const MEASUREMENT_QUERY_KEYS = {
    all: ["measurements"] as const,
    lists: () => [...MEASUREMENT_QUERY_KEYS.all, "list"] as const,
    list: (filters?: MeasurementFilters) =>
        [...MEASUREMENT_QUERY_KEYS.lists(), { filters }] as const,

    details: () => [...MEASUREMENT_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string | number) =>
        [...MEASUREMENT_QUERY_KEYS.details(), id] as const,
};  