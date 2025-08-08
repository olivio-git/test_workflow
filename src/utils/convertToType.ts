// Versión 1: Más estricta, requiere que From y To sean compatibles
export function convertToType<From extends object, To extends Partial<From>>(
    source: From,
    targetShape: To
): To {
    const keys = Object.keys(targetShape) as (keyof To)[];
    const result = {} as To;

    keys.forEach((key) => {
        if (key in source) {
            // Verificación más segura de tipos
            const value = source[key as keyof From];
            if (value !== undefined) {
                result[key] = value as To[typeof key];
            }
        }
    });

    return result;
}

// Versión 2: Más flexible, permite cualquier conversión con intersección de tipos
export function convertToTypeFlexible<From extends object, To extends object>(
    source: From,
    targetShape: To
): To {
    const keys = Object.keys(targetShape) as (keyof To)[];
    const result = {} as To;

    keys.forEach((key) => {
        // Verificamos si existe la propiedad en source
        if (key in source) {
            const sourceValue = (source as any)[key];
            result[key] = sourceValue;
        }
    });

    return result;
}

// Versión 3: Con validación de runtime y manejo de errores
export function convertToTypeSafe<From extends object, To extends object>(
    source: From,
    targetShape: To,
    options: { strict?: boolean } = {}
): Partial<To> {
    const keys = Object.keys(targetShape) as (keyof To)[];
    const result = {} as any;
    const { strict = false } = options;

    keys.forEach((key) => {
        if (key in source) {
            const sourceValue = (source as any)[key];
            const targetValue = targetShape[key];

            // Verificación básica de tipos
            if (sourceValue !== undefined) {
                if (strict && typeof sourceValue !== typeof targetValue) {
                    console.warn(`Type mismatch for key ${String(key)}: expected ${typeof targetValue}, got ${typeof sourceValue}`);
                }
                result[key] = sourceValue;
            }
        }
    });

    return result;
}

// Versión 4: Usando genéricos más avanzados para mejor inferencia de tipos
export function convertToTypeAdvanced<
    From extends Record<string, any>,
    To extends Record<string, any>
>(
    source: From,
    targetShape: To
): Pick<From, keyof From & keyof To> & Partial<To> {
    const keys = Object.keys(targetShape) as (keyof To)[];
    const result = {} as any;

    keys.forEach((key) => {
        if (key in source) {
            result[key] = source[key as keyof From];
        }
    });

    return result;
}
