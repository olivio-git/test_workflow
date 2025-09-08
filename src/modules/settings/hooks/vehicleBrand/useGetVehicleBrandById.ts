import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { VEHICLE_BRAND_QUERY_KEYS } from "../../constants/vehicleBrandQueryKeys";
import { vehiclebrandsService } from "../../services/vehicleBrand.service";

export const useGetVehicleBrandById = (id: number) => {
    return useQuery({
        queryKey: VEHICLE_BRAND_QUERY_KEYS.detail(id),
        queryFn: async () => await vehiclebrandsService.getById(id),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};