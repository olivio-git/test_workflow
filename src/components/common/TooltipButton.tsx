import type { TooltipContentProps } from "@radix-ui/react-tooltip";
import { Button, type ButtonProps } from "../atoms/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../atoms/tooltip";
import { cn } from "@/lib/utils";

type TooltipButtonProps = {
    tooltip: React.ReactNode;
    onClick?: () => void;
    children: React.ReactNode;
    tooltipContentProps?: TooltipContentProps
    buttonProps?: ButtonProps;
};

const TooltipButton: React.FC<TooltipButtonProps> = ({
    tooltip,
    onClick,
    children,
    buttonProps,
    tooltipContentProps
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                        "cursor-pointer disabled:cursor-not-allowed",
                        buttonProps?.className
                    )}
                    disabled={buttonProps?.disabled}
                    onClick={onClick}
                    {...buttonProps}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent {...tooltipContentProps}>{tooltip}</TooltipContent>
        </Tooltip>
    );
};
export default TooltipButton;