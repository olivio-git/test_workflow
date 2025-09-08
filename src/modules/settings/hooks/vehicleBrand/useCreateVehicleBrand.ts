import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateVehicleBrand } from "../../types/vehicleBrand.types";
import { vehiclebrandsService } from "../../services/vehicleBrand.service";
import { VEHICLE_BRAND_QUERY_KEYS } from "../../constants/vehicleBrandQueryKeys";

export const useCreateVehicleBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVehicleBrand) => vehiclebrandsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VEHICLE_BRAND_QUERY_KEYS.lists() });
        }
    });
};