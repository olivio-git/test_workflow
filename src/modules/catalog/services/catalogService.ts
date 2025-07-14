import apiClient from "@/lib/axios";
import type { CategoriaConSubcategorias } from "../types/category";

export const fetchCategoriesWithSubcategories = async (
    nombreCategoria?: string
): Promise<CategoriaConSubcategorias[]> => {
    const res = await apiClient.get("/products/commons/categories", {
        params: nombreCategoria ? { categoria: nombreCategoria } : {},
    });
    return res.data.data;
};

export const fetchSubcategories = async () => {
    const res = await apiClient.get("/products/commons/subcategories");
    return res.data;
};

export const fetchBrands = async () => {
    const res = await apiClient.get("/products/commons/brands");
    return res.data;
};

export const fetchOrigins = async () => {
    const res = await apiClient.get("/products/commons/origins");
    return res.data;
};

export const fetchMeasurements = async () => {
    const res = await apiClient.get("/products/commons/measurements");
    return res.data;
};
