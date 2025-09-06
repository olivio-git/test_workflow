/**
 * Singulariza una palabra aplicando reglas específicas
 */
export const singularizeWord = (word: string): string => {
    if (!word) return "";

    const lowerWord = word.trim();

    // Casos especiales para el contexto automotriz
    const specialCases: Record<string, string> = {
        'llantas': 'llanta',
        'baterías': 'batería',
        'aceites': 'aceite',
        'filtros': 'filtro',
        'frenos': 'freno',
        'amortiguadores': 'amortiguador',
        'neumáticos': 'neumático',
        'bujías': 'bujía',
        'correas': 'correa',
        'pastillas': 'pastilla',
    };

    if (specialCases[lowerWord]) {
        return specialCases[lowerWord];
    }

    // Reglas generales de singularización
    if (lowerWord.endsWith('es')) {
        return lowerWord.slice(0, -2);
    } else if (lowerWord.endsWith('s') && !lowerWord.endsWith('ss')) {
        return lowerWord.slice(0, -1);
    }

    return lowerWord;
};

/**
 * Genera una descripción basada en un array de strings
 */
export const generateDescription = (parts: (string | undefined | null)[]): string => {
    return parts
        .filter(part => part && part.toString().trim() !== "")
        .map(part => part!.toString().trim())
        .join(" ")
        .trim();
};

/**
 * Capitaliza la primera letra de una palabra
 */
export const capitalizeFirst = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
};