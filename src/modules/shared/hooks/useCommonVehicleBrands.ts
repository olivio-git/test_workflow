import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

export const useCommonVehicleBrands = (marca_vehicule?: string) => {
    return useQuery({
        queryKey: ["shared", "common-vehicle-brands", marca_vehicule],
        queryFn: async () => await commonService.getVehicleBrands(marca_vehicule),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15, // 15 minutes
        retry: 1
    });
};
