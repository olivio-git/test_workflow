import { useQuery } from "@tanstack/react-query";
import { fetchUserPermissions } from "../services/userService";

export const useUserPermissions = (userId: number) => {
  return useQuery({
    queryKey: ["userPermissions", userId],
    queryFn: async () => await fetchUserPermissions(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId && userId > 0,
  });
};
