import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateVehicleBrand } from "../../types/vehicleBrand.types";
import { vehiclebrandsService } from "../../services/vehicleBrand.service";
import { VEHICLE_BRAND_QUERY_KEYS } from "../../constants/vehicleBrandQueryKeys";

type UpdateParams = {
    id: number;
    data: UpdateVehicleBrand;
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: UpdateParams) => vehiclebrandsService.update(id, data),
        onSuccess: (updated, { id }) => {
            queryClient.invalidateQueries({ queryKey: VEHICLE_BRAND_QUERY_KEYS.lists() });
            queryClient.setQueryData(VEHICLE_BRAND_QUERY_KEYS.detail(id), updated);
        }
    });
};