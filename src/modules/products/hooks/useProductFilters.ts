import { useCallback, useState } from "react";
import type { ProductFilters } from "../types/productFilters";

export const useProductFilters = (defaultSucursal: number) => {
    const [filters, setFilters] = useState<ProductFilters>({
        pagina: 1,
        pagina_registros: 25,
        sucursal: defaultSucursal,
        descripcion: "",
    });

    const updateFilter = useCallback((key: keyof ProductFilters, value: unknown) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            pagina: 1, // Reset to page 1 when any filter is updated
        }));
    }, []);

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, pagina: page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            pagina: 1,
            pagina_registros: 25,
            sucursal: defaultSucursal,
        });
    }, [defaultSucursal]);

    return {
        filters,
        updateFilter,
        setPage,
        resetFilters,
        setFilters,
    };
};
