import type { VehicleBrandFilters } from "../types/vehicleBrand.types";

export const VEHICLE_BRAND_QUERY_KEYS = {
    all: ["vehicleBrands"] as const,
    lists: () => [...VEHICLE_BRAND_QUERY_KEYS.all, "list"] as const,
    list: (filters?: VehicleBrandFilters) =>
        [...VEHICLE_BRAND_QUERY_KEYS.lists(), { filters }] as const,

    details: () => [...VEHICLE_BRAND_QUERY_KEYS.all, "detail"] as const,
    detail: (id: string | number) =>
        [...VEHICLE_BRAND_QUERY_KEYS.details(), id] as const,
};
