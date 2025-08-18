import { useState } from "react";
import type { PurchaseFilters } from "../types/purchaseFilters";

export const usePurchaseFilters = (defaultSucursal: number) => {
    const [filters, setFilters] = useState<PurchaseFilters>({
        pagina: 1,
        pagina_registros: 10,
        sucursal: defaultSucursal,
        keywords: "",
    });

    const updateFilter = (key: keyof PurchaseFilters, value: any) => {
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
            pagina_registros: 10,
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
