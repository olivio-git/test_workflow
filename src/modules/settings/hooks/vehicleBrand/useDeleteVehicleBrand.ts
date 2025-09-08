import { useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclebrandsService } from "../../services/vehicleBrand.service";
import { VEHICLE_BRAND_QUERY_KEYS } from "../../constants/vehicleBrandQueryKeys";

export const useDeleteVehicleBrand = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => vehiclebrandsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: VEHICLE_BRAND_QUERY_KEYS.lists() });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};