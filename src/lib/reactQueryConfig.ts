import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Configuración por defecto de queries y mutations
const defaultOptions: DefaultOptions = {
    queries: {
        retry: (failureCount, error) => {
            // Si es un error 404 o 400, no tiene sentido reintentar
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status && [400, 401, 403, 404].includes(status)) {
                    return false;
                }
            }
            // Reintenta hasta 3 veces
            return failureCount < 3;
        },
        // refetchOnWindowFocus: false, // Evita refetch al cambiar de pestaña
        refetchOnReconnect: true, // Refetch si vuelve la conexión
        staleTime: 1000 * 60 * 5, // Datos frescos 5 min
        gcTime: 1000 * 60 * 30, // Mantiene cache 30 min en memoria
    },
    mutations: {
        retry: 1, // Mutaciones casi nunca deben reintentar
    },
};

// Inicialización del QueryClient
export const queryClient = new QueryClient({
    defaultOptions,
});
