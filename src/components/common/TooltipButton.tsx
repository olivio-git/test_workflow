import { Button, type ButtonProps } from "../atoms/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../atoms/tooltip";

type TooltipButtonProps = {
    tooltip: React.ReactNode;
    onClick?: () => void;
    children: React.ReactNode;
    buttonProps?: ButtonProps;
};

const TooltipButton: React.FC<TooltipButtonProps> = ({
    tooltip,
    onClick,
    children,
    buttonProps
}) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={onClick}
                    {...buttonProps}
                >
                    {children}
                </Button>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
};
export default TooltipButton;