import { ErrorHandler } from "@/utils/errorHandler";
import { showErrorToast, showWarningToast } from "./use-toast-enhanced";

export const useErrorHandler = () => {

    const handleError = (error: unknown, customTitle?: string) => {
        const result = ErrorHandler.handle(error);
        const duration = 5000

        // Mostrar toast según categoría
        switch (result.category) {
            case 'validation':
                showWarningToast({
                    title: customTitle || 'Revisa los datos',
                    description: result.userMessage,
                    duration: duration
                })
                break;
            case 'authentication':
                showErrorToast({
                    title: customTitle || 'Autenticación',
                    description: result.userMessage,
                    duration: duration
                })
                break;
            case 'network':
                showWarningToast({
                    title: customTitle || 'Conexión',
                    description: result.userMessage,
                    duration: duration
                })
                break;
            case 'server':
                showErrorToast({
                    title: customTitle || 'Error temporal',
                    description: result.userMessage,
                    duration: duration
                })
                break;
            default:
                showErrorToast({
                    title: customTitle || 'Error',
                    description: result.userMessage,
                    duration: duration
                })
        }

        return result;
    };

    return { handleError };
};