import { useCallback, useState } from "react";
import type { PaginationParams } from "../types/paginationParams";

export function useFiltersManagement<T extends PaginationParams>(initialFilters: T) {
    const [filters, setFilters] = useState<T>(initialFilters);

    const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
        setFilters((prev) =>
        ({
            ...prev,
            [key]: value,
            pagina: 1
        }));
    }, []);

    const setPage = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, pagina: page }));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
    }, []);

    return {
        filters,
        setFilters,
        updateFilter,
        setPage,
        resetFilters,
    };
}
