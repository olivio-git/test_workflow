import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { OriginFilters } from "../../types/origin.types";
import { ORIGIN_QUERY_KEYS } from "../../constants/originQueryKeys";
import { originsService } from "../../services/origin.service";

export const useGetAllOrigins = (filters: OriginFilters) => {

    return useQuery({
        queryKey: ORIGIN_QUERY_KEYS.list(filters),
        queryFn: async () => await originsService.getAll(filters),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!filters.pagina && !!filters.pagina_registros
    });
};