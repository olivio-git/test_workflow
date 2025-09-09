import { useFiltersManagement } from "@/modules/shared/hooks/useFiltersManagement";
import { useDebounce } from "use-debounce";
import type { VehicleBrandFilters } from "../../types/vehicleBrand.types";

export const useVehicleBrandFilters = () => {
    const filtersHook = useFiltersManagement<VehicleBrandFilters>({
        pagina: 1,
        pagina_registros: 25,
        marca_vehiculo: "",
    });

    const [debouncedVehicleBrand] = useDebounce(filtersHook.filters.marca_vehiculo, 500);

    const debouncedFilters: VehicleBrandFilters = {
        ...filtersHook.filters,
        marca_vehiculo: debouncedVehicleBrand,
    };

    return {
        ...filtersHook,
        filters: filtersHook.filters,
        debouncedFilters,
    };
};