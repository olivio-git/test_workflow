import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/atoms/alert-dialog";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import { Badge } from "../atoms/badge";

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "warning" | "info" | "success"
    alertMessage?: string
    isLoading?: boolean
}

const variantConfig = {
    danger: {
        icon: XCircle,
        alertBg: "bg-destructive/10 border-destructive/20",
        confirmButton: "bg-destructive hover:bg-destructive/90 text-white",
        title: "text-destructive",
    },
    warning: {
        icon: AlertTriangle,
        alertBg: "bg-amber-50 border-amber-200",
        confirmButton: "bg-amber-500 hover:bg-amber-500/90 text-white",
        title: "text-amber-500",
    },
    info: {
        icon: Info,
        alertBg: "bg-blue-50 border-blue-200",
        confirmButton: "bg-blue-600 hover:bg-blue-600/90 text-white",
        title: "text-blue-600",
    },
    success: {
        icon: CheckCircle,
        alertBg: "bg-emerald-50 border-emerald-200",
        confirmButton: "bg-emerald-500 hover:bg-emerald-500/90 text-white",
        title: "text-emerald-500",
    },
}

const alertDefaults = {
    danger: {
        title: "¿Estás seguro?",
        message: "Se requiere confirmación antes de continuar.",
        alertMessage: "Esta acción no se puede deshacer.",
    },
    success: {
        title: "Operación exitosa",
        message: "Todo salió bien, puedes continuar.",
        alertMessage: "Tu acción se completó correctamente.",
    },
    info: {
        title: "Información importante",
        message: "Revisa los detalles antes de proceder.",
        alertMessage: "Ten en cuenta esta información.",
    },
    warning: {
        title: "Advertencia",
        message: "Por favor revisa esta acción con cuidado.",
        alertMessage: "Podría tener consecuencias no deseadas.",
    },
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    alertMessage,
    isLoading = false,
}) => {

    const config = variantConfig[variant]
    const configDefaults = alertDefaults[variant]
    const IconComponent = config.icon

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className={cn(
                        "flex items-center justify-center gap-2",
                        config.title
                    )}>
                        {title ?? configDefaults.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild className="text-gray-600">
                        <div className="flex flex-col space-y-3 py-2 items-center justify-center w-full">
                            <span className="font-medium">{message ?? configDefaults.message}</span>
                            <Badge variant={variant} className={cn("fle items-center gap-3 p-1.5 rounded-md border w-full justify-center", config.alertBg)}>
                                <IconComponent className="size-4 flex-shrink-0" />
                                {alertMessage ?? configDefaults.alertMessage}
                            </Badge>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 flex sm:justify-center items-center">
                    <AlertDialogCancel
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-gray-300 h-8 cursor-pointer"

                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "h-8 cursor-pointer",
                            config.confirmButton
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                {confirmText}
                            </>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationModal;
