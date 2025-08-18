import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPermissions } from "../services/userService";
import type { UserPermissionsRequest } from "../types/User";

export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserPermissionsRequest) => updateUserPermissions(data),
    onSuccess: () => {
      // Invalidar cache de usuarios para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error en mutation de permisos:", error);
    },
  });
};
