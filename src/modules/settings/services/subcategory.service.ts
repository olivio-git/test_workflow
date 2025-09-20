import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import type { CreateSubcategory, GetAllSubcategories, GetByIdSubcategory, SubcategoryFilters, UpdateSubcategory } from "../types/subcategory.types";
import { SUBCATEGORY_ENDPOINTS } from "./endpoints/subcategoryEndpoints.service";
import { GetAllSubcategoriesSchema, GetByIdSubcategorySchema } from "../schemas/subcategory.schema";

const MODULE_NAME = 'SUBCATEGORY_SERVICE';

export const subcategoriesService = {
    /**
     * Crear una nueva subcategoria
     * @param data - Datos de la subcategoria a crear
     */
    async create(data: CreateSubcategory): Promise<GetByIdSubcategory> {
        Logger.info('Creating Subcategory', { data }, MODULE_NAME);

        const response = await ApiService.post(
            SUBCATEGORY_ENDPOINTS.create,
            data,
            GetByIdSubcategorySchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info(
            "Subcategory created successfully",
            undefined,
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las subcategorias con filtros opcionales
     */
    async getAll(filters: Partial<SubcategoryFilters>): Promise<GetAllSubcategories> {
        Logger.info('Fetching Subcategories', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            SUBCATEGORY_ENDPOINTS.all,
            GetAllSubcategoriesSchema,
            { params: filters }
        );

        Logger.info('Subcategories fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una subcategoria por ID
     * @param id - ID de la subcategoria
     */
    async getById(id: number): Promise<GetByIdSubcategory> {
        Logger.info('Fetching Subcategory detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            SUBCATEGORY_ENDPOINTS.byId(id),
            GetByIdSubcategorySchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Subcategory detail fetched successfully', {
            id
        }, MODULE_NAME);

        return response;
    },

    /**
     * Actualizar una subcategoria por ID
     * @param id - ID de la subcategoria
     * @param data - Datos para actualizar la subcategoria
     */
    async update(id: number, data: UpdateSubcategory): Promise<GetByIdSubcategory> {
        Logger.info('Updating Subcategory', { id, data }, MODULE_NAME);

        const response = await ApiService.put(
            SUBCATEGORY_ENDPOINTS.update(id),
            data,
            GetByIdSubcategorySchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Subcategory updated successfully', {
            id
        }, MODULE_NAME);
        return response;
    },

    /**
     * Eliminar una subcategoria por ID
     * @param id - ID de la subcategoria
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting Subcategory', { id }, MODULE_NAME);

        await ApiService.delete(SUBCATEGORY_ENDPOINTS.delete(id));

        Logger.info('Subcategory deleted successfully', { id }, MODULE_NAME);
    },
};