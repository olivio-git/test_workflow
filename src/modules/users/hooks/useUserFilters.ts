import { useState } from "react";
import type { UserFilters } from "../types/User";

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFilters>({
    pagina: 1,
    pagina_registros: 20,
  });

  const updateFilter = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Si cambio algún filtro que no sea página, resetear a página 1
      ...(key !== 'pagina' && { pagina: 1 }),
    }));
  };

  const setPage = (page: number) => {
    updateFilter('pagina', page);
  };

  const resetFilters = () => {
    setFilters({
      pagina: 1,
      pagina_registros: 20,
    });
  };

  return {
    filters,
    updateFilter,
    setPage,
    resetFilters,
  };
};
