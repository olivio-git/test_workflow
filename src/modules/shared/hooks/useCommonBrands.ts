import { useQuery } from "@tanstack/react-query";
import { fetchBrands } from "../services/sharedService";

export const useCommonBrands = (marca?: string) => {
    return useQuery({
        queryKey: ["catalog", "common-brands", marca],
        queryFn: () => fetchBrands(marca),
    });
};
