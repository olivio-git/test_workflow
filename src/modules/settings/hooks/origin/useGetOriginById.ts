import { useQuery } from "@tanstack/react-query";
import { ORIGIN_QUERY_KEYS } from "../../constants/originQueryKeys";
import { originsService } from "../../services/origin.service";

export const useGetOriginById = (id: number) => {
    return useQuery({
        queryKey: ORIGIN_QUERY_KEYS.detail(id),
        queryFn: async () => await originsService.getById(id),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!id
    });
};