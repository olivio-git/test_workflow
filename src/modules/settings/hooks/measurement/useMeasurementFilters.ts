import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import { useDebounce } from "use-debounce";
import type { MeasurementFilters } from "../../types/measurement.types";

export const useMeasurementFilters = () => {
    const filtersHook = useFiltersManagement<MeasurementFilters>({
        pagina: 1,
        pagina_registros: 25,
        unidad_medida: "",
    });

    const [debouncedMeasurement] = useDebounce(filtersHook.filters.unidad_medida, 500);

    const debouncedFilters: MeasurementFilters = {
        ...filtersHook.filters,
        unidad_medida: debouncedMeasurement,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};