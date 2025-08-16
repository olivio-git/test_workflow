// 🔹 Helper para eliminar claves undefined
export const cleanUndefined = <T extends object>(obj: T) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as Partial<T>;

export const toUndefinedIfEmpty = (val: unknown) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (typeof val === "number" && isNaN(val)) return undefined;
    return val;
};

export const toDateOrUndefined = (val: unknown) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const date = new Date(val as string | number);
    return isNaN(date.getTime()) ? undefined : date;
};
