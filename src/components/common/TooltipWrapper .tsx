import { Tooltip, TooltipContent, TooltipTrigger } from "../atoms/tooltip";

type TooltipWrapperProps = {
    tooltip: React.ReactNode;
    children: React.ReactNode;
};

export const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ tooltip, children }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
};
