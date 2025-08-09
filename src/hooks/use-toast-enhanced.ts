import { toast } from "@/hooks/use-toast"

export type ToastVariant = "info" | "success" | "warning" | "error"

interface ToastOptions {
    title: string
    description?: string
    variant?: ToastVariant
    duration?: number
}

export const showInfoToast = (options: Omit<ToastOptions, "variant">) => {
    return toast({
        variant: "info",
        ...options,
    })
}

export const showSuccessToast = (options: Omit<ToastOptions, "variant">) => {
    return toast({
        variant: "success",
        ...options,
    })
}

export const showWarningToast = (options: Omit<ToastOptions, "variant">) => {
    return toast({
        variant: "warning",
        ...options,
    })
}

export const showErrorToast = (options: Omit<ToastOptions, "variant">) => {
    return toast({
        variant: "error",
        ...options,
    })
}

export const showToast = (options: ToastOptions) => {
    return toast(options)
}