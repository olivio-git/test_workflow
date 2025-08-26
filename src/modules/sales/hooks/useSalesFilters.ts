import { useCallback, useState } from "react";
import type { SalesFilters } from "../types/salesFilters";

export const useSalesFilters = (defaultSucursal: number) => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const [filters, setFilters] = useState<SalesFilters>({
        pagina: 1,
        pagina_registros: 25,
        sucursal: defaultSucursal,
        fecha_fin: today,
        fecha_inicio: lastMonth
    });

    const updateFilter = useCallback((key: keyof SalesFilters, value: unknown) => {
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
