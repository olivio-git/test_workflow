import { Logger } from "@/lib/logger";
import type { BrandFilters, CreateBrand, GetAllBrands, GetByIdBrand, UpdateBrand } from "../types/brand.types";
import { ApiService } from "@/lib/apiService";
import { BRAND_ENDPOINTS } from "./endpoints/brandEndpoints.service";
import { GetAllBrandsSchema, GetByIdBrandSchema } from "../schemas/brand.schema";

const MODULE_NAME = 'BRAND_SERVICE';

export const brandsService = {
    /**
     * Crear una nueva marca
     * @param data - Datos de la marca a crear
     */
    async create(data: CreateBrand): Promise<GetByIdBrand> {
        Logger.info('Creating Brand', { data }, MODULE_NAME);

        const response = await ApiService.post(
            BRAND_ENDPOINTS.create,
            data,
            GetByIdBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info(
            "Brand created successfully",
            undefined,
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las marcas con filtros opcionales
     */
    async getAll(filters: Partial<BrandFilters>): Promise<GetAllBrands> {
        Logger.info('Fetching Brands', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            BRAND_ENDPOINTS.all,
            GetAllBrandsSchema,
            { params: filters }
        );

        Logger.info('Brands fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una marca por ID
     * @param id - ID de la marca
     */
    async getById(id: number): Promise<GetByIdBrand> {
        Logger.info('Fetching Brand detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            BRAND_ENDPOINTS.byId(id),
            GetByIdBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Brand detail fetched successfully', {
            id
        }, MODULE_NAME);

        return response;
    },

    /**
     * Actualizar una marca por ID
     * @param id - ID de la marca
     * @param data - Datos para actualizar la marca
     */
    async update(id: number, data: UpdateBrand): Promise<GetByIdBrand> {
        Logger.info('Updating Brand', { id, data }, MODULE_NAME);

        const response = await ApiService.put(
            BRAND_ENDPOINTS.update(id),
            data,
            GetByIdBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Brand updated successfully', {
            id
        }, MODULE_NAME);
        return response;
    },

    /**
     * Eliminar una marca por ID
     * @param id - ID de la marca
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting Brand', { id }, MODULE_NAME);

        await ApiService.delete(BRAND_ENDPOINTS.delete(id));

        Logger.info('Brand deleted successfully', { id }, MODULE_NAME);
    },
};