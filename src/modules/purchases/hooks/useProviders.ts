import { useQuery } from "@tanstack/react-query";
import { fetchProviders } from "../services/purchaseService";

export const useProviders = () => {
    return useQuery({
        queryKey: ["providers"],
        queryFn: () => fetchProviders(""), // Cargar todos los proveedores con "TODO"
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
