import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { MeasurementFilters } from "../../types/measurement.types";
import { MEASUREMENT_QUERY_KEYS } from "../../constants/measurementQueryKeys";
import { measurementsService } from "../../services/measurement.service";

export const useGetAllMeasurements = (filters: MeasurementFilters) => {

    return useQuery({
        queryKey: MEASUREMENT_QUERY_KEYS.list(filters),
        queryFn: async () => await measurementsService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};