import { ErrorHandler } from "@/utils/errorHandler";
import { showErrorToast, showWarningToast } from "./use-toast-enhanced";

interface HandleErrorProps {
    error: unknown,
    customTitle?: string,
    customDescription?: string,
    duration?: number;
}

export const useErrorHandler = () => {

    const handleError = ({
        error,
        customTitle,
        customDescription,
        duration = 5000
    }: HandleErrorProps) => {
        const result = ErrorHandler.handle(error);
        const description = customDescription ?? result.userMessage;
        // Mostrar toast según categoría
        switch (result.category) {
            case 'validation':
                showWarningToast({
                    title: customTitle || 'Revisa los datos',
                    description: description,
                    duration: duration
                })
                break;
            case 'authentication':
                showErrorToast({
                    title: customTitle || 'Autenticación',
                    description: description,
                    duration: duration
                })
                break;
            case 'network':
                showWarningToast({
                    title: customTitle || 'Conexión',
                    description: description,
                    duration: duration
                })
                break;
            case 'server':
                showErrorToast({
                    title: customTitle || 'Error temporal',
                    description: description,
                    duration: duration
                })
                break;
            default:
                showErrorToast({
                    title: customTitle || 'Error',
                    description: description,
                    duration: duration
                })
        }

        return result;
    };

    return { handleError };
};