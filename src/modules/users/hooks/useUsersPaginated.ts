import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchUsers } from "../services/userService";
import type { UserFilters } from "../types/User";

export const useUsersPaginated = (filters: UserFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => await fetchUsers(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
