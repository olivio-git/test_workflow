import { useQuery } from "@tanstack/react-query";
import { fetchBrands } from "../services/catalogService";

export const useCommonBrands = (marca?: string) => {
    return useQuery({
        queryKey: ["catalog", "common-brands", marca],
        queryFn: () => fetchBrands(marca),
    });
};
