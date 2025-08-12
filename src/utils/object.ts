// pick: selecciona propiedades específicas
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<T, K>;
}

// omit: excluye propiedades específicas
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clone = { ...obj };
    keys.forEach((key) => {
        delete clone[key];
    });
    return clone;
}

// isObject: verifica si es un objeto plano
export function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// deepClone: clona profundamente un objeto (simple)
export function deepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

// isEmptyObject: verifica si un objeto no tiene propiedades
export function isEmptyObject(obj: object): boolean {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// merge: fusiona objetos (shallow merge)
export function merge<T extends object, U extends object>(target: T, source: U): T & U {
    return { ...target, ...source };
}