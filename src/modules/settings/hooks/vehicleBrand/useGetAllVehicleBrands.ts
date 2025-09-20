import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { VehicleBrandFilters } from "../../types/vehicleBrand.types";
import { VEHICLE_BRAND_QUERY_KEYS } from "../../constants/vehicleBrandQueryKeys";
import { vehiclebrandsService } from "../../services/vehicleBrand.service";

export const useGetAllVehicleBrands = (filters: VehicleBrandFilters) => {

    return useQuery({
        queryKey: VEHICLE_BRAND_QUERY_KEYS.list(filters),
        queryFn: () => vehiclebrandsService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};