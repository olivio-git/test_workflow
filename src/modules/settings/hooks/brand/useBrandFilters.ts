import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import type { BrandFilters } from "../../types/brand.types";
import { useDebounce } from "use-debounce";

export const useBrandFilters = () => {
    const filtersHook = useFiltersManagement<BrandFilters>({
        pagina: 1,
        pagina_registros: 25,
        marca: "",
    });

    const [debouncedBrand] = useDebounce(filtersHook.filters.marca, 500);

    const debouncedFilters: BrandFilters = {
        ...filtersHook.filters,
        marca: debouncedBrand,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};