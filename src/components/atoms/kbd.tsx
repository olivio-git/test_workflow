import { cn } from "@/lib/utils"
import * as React from "react"

const Kbd = React.forwardRef<HTMLElement, React.ComponentProps<"kbd">>(
    ({ className, ...props }, ref) => {
        return (
            <kbd
                className={cn(
                    "text-gray-400 border-gray-200 inline-flex h-5 min-w-5 shadow-sm items-center justify-center rounded border px-1 font-medium font-mono text-[0.625rem]",
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