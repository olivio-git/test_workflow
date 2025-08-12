"use client"

import { useToast } from "@/hooks/use-toast"
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  ToastWithIcon,
} from "@/components/atoms/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <ToastWithIcon key={id} {...props}>
            <div className="flex flex-col">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </ToastWithIcon>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
