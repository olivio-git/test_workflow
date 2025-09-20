import { useQuery } from "@tanstack/react-query";
import { MEASUREMENT_QUERY_KEYS } from "../../constants/measurementQueryKeys";
import { measurementsService } from "../../services/measurement.service";

export const useGetMeasurementById = (id: number) => {
    return useQuery({
        queryKey: MEASUREMENT_QUERY_KEYS.detail(id),
        queryFn: () => measurementsService.getById(id),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};