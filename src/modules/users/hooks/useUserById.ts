import { useQuery } from "@tanstack/react-query";
import { fetchPermissionsByUserId, fetchUserByNickName } from "../services/userService";

export const useUserByNickName = (nickname: string) => {
  return useQuery({
    queryKey: ["users", nickname],
    queryFn: async () => await fetchUserByNickName(nickname),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!nickname,
  });
};
export const usePermissionsByUserId = (userId: number) => {
  return useQuery({
    queryKey: ["permissions", userId],
    queryFn: async () => await fetchPermissionsByUserId(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId && userId > 0,
  });
};