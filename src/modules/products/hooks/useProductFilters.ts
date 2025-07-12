import { useState } from "react";
import type { ProductFilters } from "../types/productFilters";

export const useProductFilters = (defaultSucursal: number) => {
    const [filters, setFilters] = useState<ProductFilters>({
        pagina: 1,
        pagina_registros: 25,
        sucursal: defaultSucursal,
        descripcion: "",
    });

    const updateFilter = (key: keyof ProductFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
            pagina: 1, // Reset to page 1 when any filter is updated
        }));
    };

    const setPage = (page: number) => {
        setFilters((prev) => ({ ...prev, pagina: page }));
    };

    const resetFilters = () => {
        setFilters({
            pagina: 1,
            pagina_registros: 20,
            sucursal: defaultSucursal,
        });
    };

    return {
        filters,
        updateFilter,
        setPage,
        resetFilters,
        setFilters,
    };
};
