import type { Brands } from "../types/brand.type";
import { COMMON_ENDPOINTS } from "./endpoints";
import type { MeasurementList } from "../types/measurements.types";
import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import type { CategoriesWithSubcategories, Subcategories } from "../types/category.types";
import { CategoriesWithSubcategoriesSchema, SubcategoriesSchema } from "../schemas/category.schema";
import { BrandsSchema } from "../schemas/brand.schema";
import { MeasurementListSchema } from "../schemas/measurements.schema";
import type { OriginsList } from "../types/origins.types";
import { OriginListSchema } from "../schemas/origins.schema";
import type { VehicleBrandList } from "../types/vehicleBrand.types";
import { VehicleBrandListSchema } from "../schemas/vehicleBrands.schema";

const MODULE_NAME = "COMMON_SERVICE";

export const commonService = {
    /**
     * Obtener categorías con subcategorías
     * @param categoria - Filtro opcional por nombre de categoría
     */
    async getCategoriesWithSubcategories(categoria?: string): Promise<CategoriesWithSubcategories> {
        Logger.info("Fetching categories with subcategories", { categoria }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.categories,
            CategoriesWithSubcategoriesSchema,
            { params: categoria ? { categoria } : {} },
            { unwrapData: true }
        );

        Logger.info("Categories with subcategories fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener subcategorías con filtros opcionales
     * @param subcategoria - Filtro opcional por nombre de subcategoría
     * @param categoria - Filtro opcional por ID de categoría
     */
    async getSubcategories(subcategoria?: string, categoria?: number): Promise<Subcategories> {
        Logger.info("Fetching subcategories", { categoria, subcategoria }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.subcategories,
            SubcategoriesSchema,
            {
                params: {
                    ...(subcategoria && { subcategoria }),
                    ...(categoria && { categoria }),
                },
            },
            { unwrapData: true }
        );

        Logger.info("Subcategories fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener marcas con filtros opcionales
     * @param marca - Filtro opcional por nombre de marca
     */
    async getBrands(marca?: string): Promise<Brands> {
        Logger.info("Fetching brands", { marca }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.brands,
            BrandsSchema,
            { params: marca ? { marca } : {} },
            { unwrapData: true }
        );

        Logger.info("Brands fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener procedencias con filtros opcionales
     * @param procedencia - Filtro opcional por nombre de procedencia
     */
    async getOrigins(procedencia?: string): Promise<OriginsList> {
        Logger.info("Fetching origins", { procedencia }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.origins,
            OriginListSchema,
            { params: procedencia ? { procedencia } : {} },
            { unwrapData: true }
        );

        Logger.info("Origins fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener unidades de medida con filtros opcionales
     * @param unidad_medida - Filtro opcional por nombre de unidad de medida
     */
    async getMeasurements(unidad_medida?: string): Promise<MeasurementList> {
        Logger.info("Fetching measurements", { unidad_medida }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.measurements,
            MeasurementListSchema,
            { params: unidad_medida ? { unidad_medida } : {} },
            { unwrapData: true }
        );

        Logger.info("Measurements fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener marcas de vehiculo con filtros opcionales
     * @param marca_vehicule - Filtro opcional por nombre de marca de vehiculo
     */
    async getVehicleBrands(marca_vehicule?: string): Promise<VehicleBrandList> {
        Logger.info("Fetching vehicle brands", { marca_vehicule }, MODULE_NAME);

        const response = await ApiService.get(
            COMMON_ENDPOINTS.vehicle_brands,
            VehicleBrandListSchema,
            { params: marca_vehicule ? { marca_vehicule } : {} },
            { unwrapData: true }
        );

        Logger.info("Behicle brands fetched successfully", {
            count: response.length,
        }, MODULE_NAME);

        return response;
    },
};