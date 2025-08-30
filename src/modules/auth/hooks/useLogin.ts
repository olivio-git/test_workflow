import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Login } from "../types/login.types";
import { authService } from "../services/authService";

export const AUTH_QUERY_KEYS = {
    auth: ['auth'] as const,
} as const;

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: Login) => authService.login(credentials),
        onSuccess: () => {

            queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.auth });

        },
    });
};