import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import { ORIGIN_ENDPOINTS } from "./endpoints/originEndpoints.service";
import type { CreateOrigin, GetAllOrigins, GetByIdOrigin, OriginFilters, UpdateOrigin } from "../types/origin.types";
import { GetAllOriginsSchema, GetByIdOriginSchema } from "../schemas/origin.schema";

const MODULE_NAME = 'ORIGIN_SERVICE';

export const originsService = {
    /**
     * Crear una nueva procedencia
     * @param data - Datos de la procedencia a crear
     */
    async create(data: CreateOrigin): Promise<GetByIdOrigin> {
        Logger.info('Creating Origin', { data }, MODULE_NAME);

        const response = await ApiService.post(
            ORIGIN_ENDPOINTS.create,
            data,
            GetByIdOriginSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info(
            "Origin created successfully",
            undefined,
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las procedencias con filtros opcionales
     */
    async getAll(filters: Partial<OriginFilters>): Promise<GetAllOrigins> {
        Logger.info('Fetching Origins', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            ORIGIN_ENDPOINTS.all,
            GetAllOriginsSchema,
            { params: filters }
        );

        Logger.info('Origins fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una procedencia por ID
     * @param id - ID de la procedencia
     */
    async getById(id: number): Promise<GetByIdOrigin> {
        Logger.info('Fetching Origin detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            ORIGIN_ENDPOINTS.byId(id),
            GetByIdOriginSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Origin detail fetched successfully', {
            id
        }, MODULE_NAME);

        return response;
    },

    /**
     * Actualizar una procedencia por ID
     * @param id - ID de la procedencia
     * @param data - Datos para actualizar la procedencia
     */
    async update(id: number, data: UpdateOrigin): Promise<GetByIdOrigin> {
        Logger.info('Updating Origin', { id, data }, MODULE_NAME);

        const response = await ApiService.put(
            ORIGIN_ENDPOINTS.update(id),
            data,
            GetByIdOriginSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Origin updated successfully', {
            id
        }, MODULE_NAME);
        return response;
    },

    /**
     * Eliminar una procedencia por ID
     * @param id - ID de la procedencia
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting Origin', { id }, MODULE_NAME);

        await ApiService.delete(ORIGIN_ENDPOINTS.delete(id));

        Logger.info('Origin deleted successfully', { id }, MODULE_NAME);
    },
};