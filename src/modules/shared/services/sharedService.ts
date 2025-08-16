import apiClient from "@/lib/axios";
import type { CategoriaConSubcategorias } from "../types/category";
import type { Marca } from "../types/brand";
import { COMMON_ENDPOINTS } from "./endpoints";
import type { Measurements } from "../types/measurements";

export const fetchCategoriesWithSubcategories = async (
    categoria?: string
): Promise<CategoriaConSubcategorias[]> => {
    const res = await apiClient.get(COMMON_ENDPOINTS.categories, {
        params: categoria ? { categoria: categoria } : {},
    });
    return res.data.data;
};

export const fetchSubcategories = async (categoria?: string, subcategoria?: string) => {
    const res = await apiClient.get(COMMON_ENDPOINTS.subcategories, {
        params: {
            ...(categoria && { categoria }),
            ...(subcategoria && { subcategoria }),
        },
    });
    return res.data.data;
};

export const fetchBrands = async (marca?: string): Promise<Marca[]> => {
    const res = await apiClient.get(COMMON_ENDPOINTS.brands, {
        params: marca ? { marca } : {},
    });
    return res.data.data
};

export const fetchOrigins = async (procedencia?: string) => {
    const res = await apiClient.get(COMMON_ENDPOINTS.origins, {
        params: procedencia ? { procedencia } : {},
    });
    return res.data.data;
};

export const fetchMeasurements = async (unidad_medida?: string): Promise<Measurements[]> => {
    const res = await apiClient.get(COMMON_ENDPOINTS.measurements, {
        params: unidad_medida ? { unidad_medida } : {},
    });
    return res.data.data;
};
