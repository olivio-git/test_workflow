import { Logger } from "@/lib/logger";
import type { Login } from "../types/login.types";
import authSDK from "@/services/sdk-simple-auth";

const MODULE_NAME = 'AUTH_SERVICE';

export const authService = {
    /**
     * Iniciar sesión con credenciales
     * @param credentials - Credenciales de login (username y password)
     */
    async login(credentials: Login): Promise<unknown> {
        Logger.info('Attempting login', { user: credentials.usuario }, MODULE_NAME);

        const response = await authSDK.login(credentials)

        Logger.info('Login successful', {
            user: response.name,
        }, MODULE_NAME);

        return response;
    },
};