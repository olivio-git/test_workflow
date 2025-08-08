import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../atoms/button";

interface ErrorDataProps {
    onRetry?: () => void;
    errorMessage?: string;
    isRetrying?: boolean;
    buttonText?: string
    showButtonIcon?: boolean
}
const ErrorDataComponent: React.FC<ErrorDataProps> = ({
    onRetry,
    errorMessage,
    isRetrying = false,
    buttonText = 'Intentar nuevamente',
    showButtonIcon = true
}) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-6 px-12 py-16 mx-auto bg-red-50 rounded-3xl border border-red-100">
            <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-3 text-center">
                <h3 className="text-lg font-semibold text-destructive">
                    ¡Ups! Algo salió mal
                </h3>
                <p className="text-sm text-red-400 leading-relaxed">
                    {errorMessage ?? 'Ocurrió un error al cargar los datos'}. Por favor, intenta nuevamente.
                </p>
            </div>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant={'destructive'}
                    disabled={isRetrying}
                >
                    {isRetrying ? (
                        <>
                            {showButtonIcon && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                            Cargando...
                        </>
                    ) : (
                        <>
                            {showButtonIcon && <RefreshCw className="h-4 w-4 mr-2" />}
                            {buttonText}
                        </>
                    )}
                </Button>
            )}
        </div>
    );
}

export default ErrorDataComponent;