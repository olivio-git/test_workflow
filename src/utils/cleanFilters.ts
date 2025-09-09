export function cleanFilters<T extends Record<string, unknown>>(filters: T): Partial<T> {
    const cleaned: Partial<T> = {};
    (Object.keys(filters) as (keyof T)[]).forEach((key) => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== "") {
            cleaned[key] = value;
        }
    });
    return cleaned;
}