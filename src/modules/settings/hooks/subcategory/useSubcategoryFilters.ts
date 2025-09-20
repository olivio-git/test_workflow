import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import { useDebounce } from "use-debounce";
import type { SubcategoryFilters } from "../../types/subcategory.types";

export const useSubcategoryFilters = () => {
    const filtersHook = useFiltersManagement<SubcategoryFilters>({
        pagina: 1,
        pagina_registros: 25,
        subcategoria: "",
    });

    const [debouncedSubcategory] = useDebounce(filtersHook.filters.subcategoria, 500);

    const debouncedFilters: SubcategoryFilters = {
        ...filtersHook.filters,
        subcategoria: debouncedSubcategory,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};