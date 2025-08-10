export const formatCell = (
    value: any,
    fallback?: string | number
): string | number => {
    if (value === null || value === undefined || value === "") {
        if (fallback !== undefined) return fallback;
        return typeof value === "number" ? "-" : "N/A";
    }

    // Si es número pero no válido
    if (typeof value === "number" && isNaN(value)) {
        return fallback !== undefined ? fallback : "-";
    }

    return value;
};
