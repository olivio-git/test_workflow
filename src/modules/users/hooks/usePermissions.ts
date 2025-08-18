import { useQuery } from "@tanstack/react-query";
import { fetchPermissions } from "../services/userService";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
