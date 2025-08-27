import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

export const useCommonMeasurements = (unidad_medida?: string) => {
    return useQuery({
        queryKey: ["catalog", "common-measurements", unidad_medida],
        queryFn: async () => await commonService.getMeasurements(unidad_medida),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    });
};
