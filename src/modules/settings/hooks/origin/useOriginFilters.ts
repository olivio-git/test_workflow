import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import { useDebounce } from "use-debounce";
import type { OriginFilters } from "../../types/origin.types";

export const useOriginFilters = () => {
    const filtersHook = useFiltersManagement<OriginFilters>({
        pagina: 1,
        pagina_registros: 25,
        procedencia: "",
    });

    const [debouncedOrigin] = useDebounce(filtersHook.filters.procedencia, 500);

    const debouncedFilters: OriginFilters = {
        ...filtersHook.filters,
        procedencia: debouncedOrigin,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};