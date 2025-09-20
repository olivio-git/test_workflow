import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import { useDebounce } from "use-debounce";
import type { CategoryFilters } from "../../types/category.types";

export const useCategoryFilters = () => {
    const filtersHook = useFiltersManagement<CategoryFilters>({
        pagina: 1,
        pagina_registros: 25,
        categoria: "",
    });

    const [debouncedCategoria] = useDebounce(filtersHook.filters.categoria, 500);

    const debouncedFilters: CategoryFilters = {
        ...filtersHook.filters,
        categoria: debouncedCategoria,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};