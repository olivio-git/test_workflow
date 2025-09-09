import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/atoms/select";
import { ROWS_OPTIONS } from "@/modules/shared/constants/tableOptions";
import { cn } from "@/lib/utils";

interface RowsPerPageSelectProps {
    value: number | string;
    onChange: (rows: number) => void;
    triggerClassname?: string;
    contentClassname?: string;
}

const RowsPerPageSelect: React.FC<RowsPerPageSelectProps> = ({
    value,
    onChange,
    triggerClassname,
    contentClassname,
}) => {
    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onChange(parseInt(val))}
        >
            <SelectTrigger className={cn(
                "space-x-2 max-w-max w-full",
                triggerClassname
            )}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn(
                "shadow-lg",
                contentClassname
            )}>
                {ROWS_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                        {label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
export default RowsPerPageSelect