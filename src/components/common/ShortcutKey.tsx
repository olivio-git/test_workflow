import React from "react";
import { Kbd } from "../atoms/kbd";

type ShortcutKeyProps = {
    combo: string; // Ej: "Ctrl + Shift + C"
    variant?: "light" | "dark";
    showPlus?: boolean;
};

const ShortcutKey: React.FC<ShortcutKeyProps> = ({ combo, variant, showPlus = true }) => {
    const keys = combo.split("+").map((k) => k.trim());

    const plusClass =
        variant === "dark"
            ? "text-gray-300"
            : variant === "light"
                ? "text-gray-500"
                : "text-muted-foreground";

    return (
        <span className="inline-flex gap-1 items-center">
            {keys.map((key, index) => (
                <React.Fragment key={index}>
                    <span className="inline-flex items-center">
                        <Kbd variant={variant}>{key}</Kbd>
                    </span>
                    {showPlus && index < keys.length - 1 && (
                        <span className={`text-xs ${plusClass}`}>+</span>
                    )}
                </React.Fragment>
            ))}
        </span>
    );
};

export default ShortcutKey;