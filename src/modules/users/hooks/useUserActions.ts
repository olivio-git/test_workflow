import { useMutation } from "@tanstack/react-query";

// Placeholder para futuras funcionalidades de usuarios
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: number) => {
      // Implementar cuando tengas el endpoint de eliminación
      console.log('Eliminando usuario:', userId);
      // return await deleteUser(userId);
      return Promise.resolve();
    },
    onError: (error) => {
      console.error("Error al eliminar usuario:", error);
    },
  });
};

export const useToggleUserStatus = () => {
  return useMutation({
    mutationFn: async ({ userId, active }: { userId: number; active: boolean }) => {
      // Implementar cuando tengas el endpoint de cambio de estado
      console.log('Cambiando estado del usuario:', userId, 'a', active);
      // return await toggleUserStatus(userId, active);
      return Promise.resolve();
    },
    onError: (error) => {
      console.error("Error al cambiar estado del usuario:", error);
    },
  });
};
