import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { commonService } from "../services/sharedService";

export const useCommonOrigins = (procedencia?: string) => {
    return useQuery({
        queryKey: ["shared", "common-origins", procedencia],
        queryFn: async () => await commonService.getOrigins(procedencia),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 15, // 15 minutes
        retry: 1
    });
};
