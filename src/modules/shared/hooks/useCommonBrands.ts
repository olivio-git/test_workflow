import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

export const useCommonBrands = (marca?: string) => {
    return useQuery({
        queryKey: ["catalog", "common-brands", marca],
        queryFn: async () => await commonService.getBrands(marca),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    });
};
