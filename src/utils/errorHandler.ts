import type { ApiError } from "@/types/apiError.types";
import { AxiosError } from "axios";

interface ErrorResult {
    userMessage: string;
    shouldRetry: boolean;
    category: "validation" | "network" | "server" | "authentication" | "unknown";
}

// 👇 Type Guard para validar si la respuesta tiene el formato esperado
function isApiErrorResponse(data: unknown): data is { error: ApiError } {
    return typeof data === "object" && data !== null && "error" in data;
}

export class ErrorHandler {
    static handle(error: unknown): ErrorResult {
        if (error instanceof AxiosError) {
            return this.handleAxiosError(error);
        }

        if (error instanceof Error) {
            return {
                userMessage:
                    "Algo salió mal. Si el problema persiste, contacta soporte.",
                shouldRetry: false,
                category: "unknown",
            };
        }

        return {
            userMessage: "Ocurrió un error inesperado. Inténtalo de nuevo.",
            shouldRetry: false,
            category: "unknown",
        };
    }

    private static handleAxiosError(error: AxiosError): ErrorResult {
        // Error de red
        if (!error.response) {
            return {
                userMessage:
                    "Problema de conexión. Verifica tu internet e inténtalo de nuevo.",
                shouldRetry: true,
                category: "network",
            };
        }

        // 👇 Validamos la forma de la respuesta antes de acceder
        let apiError: ApiError | undefined;
        if (isApiErrorResponse(error.response.data)) {
            apiError = error.response.data.error;
        }

        const status = error.response.status;
        const serverMessage = apiError?.message;

        return this.handleByStatus(status, serverMessage);
    }

    private static handleByStatus(
        status: number,
        serverMessage?: string,
        // validationErrors?: ValidationError[]
    ): ErrorResult {
        switch (status) {
            case 400:
                return {
                    userMessage: serverMessage || "Datos incorrectos. Revisa la información.",
                    shouldRetry: false,
                    category: "validation",
                };

            case 401:
                return {
                    userMessage: serverMessage || "Sesión expirada. Inicia sesión nuevamente.",
                    shouldRetry: false,
                    category: "authentication",
                };

            case 403:
                return {
                    userMessage: serverMessage || "No tienes permisos para esta acción.",
                    shouldRetry: false,
                    category: "authentication",
                };

            case 404:
                return {
                    userMessage: serverMessage || "Información no encontrada.",
                    shouldRetry: false,
                    category: "validation",
                };

            case 422:
                let message = serverMessage || "Corrige los siguientes errores:";

                // if (validationErrors?.length) {
                //     const errors = validationErrors
                //         .map((err) => `• ${err.message}`)
                //         .join("\n");
                //     message += `\n\n${errors}`;
                // }

                return {
                    userMessage: message,
                    shouldRetry: false,
                    category: "validation",
                };

            case 429:
                return {
                    userMessage: serverMessage || "Demasiadas solicitudes. Espera un momento.",
                    shouldRetry: true,
                    category: "network",
                };

            case 500:
            case 502:
            case 503:
            case 504:
                return {
                    userMessage:
                        serverMessage || "Problemas técnicos temporales. Inténtalo en unos minutos.",
                    shouldRetry: true,
                    category: "server",
                };

            default:
                return {
                    userMessage: serverMessage || "Error inesperado. Contacta soporte si persiste.",
                    shouldRetry: false,
                    category: "unknown",
                };
        }
    }
}
