import { useQuery } from "@tanstack/react-query";
import { fetchMeasurements } from "../services/sharedService";

export const useCommonMeasurements = (unidad_medida?: string) => {
    return useQuery({
        queryKey: ["catalog", "common-measurements", unidad_medida],
        queryFn: () => fetchMeasurements(unidad_medida),
    });
};
