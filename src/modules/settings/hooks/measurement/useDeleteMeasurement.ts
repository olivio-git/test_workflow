import { useMutation, useQueryClient } from "@tanstack/react-query";
import { measurementsService } from "../../services/measurement.service";
import { MEASUREMENT_QUERY_KEYS } from "../../constants/measurementQueryKeys";

export const useDeleteMeasurement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => measurementsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEASUREMENT_QUERY_KEYS.lists() });
        },
        retry: false,
        networkMode: 'offlineFirst',
        gcTime: 1000 * 60 * 3,
    });
};