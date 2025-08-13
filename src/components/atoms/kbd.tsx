import { cn } from "@/lib/utils"
import * as React from "react"

type KbdProps = React.ComponentProps<"kbd"> & {
    variant?: "light" | "dark";
};

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
    ({ className, variant = "light", ...props }, ref) => {
        const variantClasses =
            variant === "dark"
                ? "bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/30 shadow-gray-600"
                : "text-gray-400 border-gray-200 bg-white";

        return (
            <kbd
                className={cn(
                    "inline-flex h-5 min-w-5 shadow-sm items-center justify-center rounded border px-1 font-medium font-mono text-[0.625rem]",
                    variantClasses,
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Kbd.displayName = "Kbd"

export { Kbd }