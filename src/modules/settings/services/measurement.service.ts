import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import type { CreateMeasurement, GetAllMeasurements, GetByIdMeasurement, MeasurementFilters, UpdateMeasurement } from "../types/measurement.types";
import { MEASUREMENT_ENDPOINTS } from "./endpoints/measurementEndpoints.service";
import { GetAllMeasurementsSchema, GetByIdMeasurementSchema } from "../schemas/measurement.schema";

const MODULE_NAME = 'MEASUREMENT_SERVICE';

export const measurementsService = {
    /**
     * Crear una nueva unidad de medida
     * @param data - Datos de la unidad de medida a crear
     */
    async create(data: CreateMeasurement): Promise<GetByIdMeasurement> {
        Logger.info('Creating Measurement', { data }, MODULE_NAME);

        const response = await ApiService.post(
            MEASUREMENT_ENDPOINTS.create,
            data,
            GetByIdMeasurementSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info(
            "Measurement created successfully",
            undefined,
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las unidades de medida con filtros opcionales
     */
    async getAll(filters: Partial<MeasurementFilters>): Promise<GetAllMeasurements> {
        Logger.info('Fetching Measurements', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            MEASUREMENT_ENDPOINTS.all,
            GetAllMeasurementsSchema,
            { params: filters }
        );

        Logger.info('Measurements fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una unidad de medida por ID
     * @param id - ID de la unidad de medida
     */
    async getById(id: number): Promise<GetByIdMeasurement> {
        Logger.info('Fetching Measurement detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            MEASUREMENT_ENDPOINTS.byId(id),
            GetByIdMeasurementSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Measurement detail fetched successfully', {
            id
        }, MODULE_NAME);

        return response;
    },

    /**
     * Actualizar una unidad de medida por ID
     * @param id - ID de la unidad de medida
     * @param data - Datos para actualizar la unidad de medida
     */
    async update(id: number, data: UpdateMeasurement): Promise<GetByIdMeasurement> {
        Logger.info('Updating Measurement', { id, data }, MODULE_NAME);

        const response = await ApiService.put(
            MEASUREMENT_ENDPOINTS.update(id),
            data,
            GetByIdMeasurementSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Measurement updated successfully', {
            id
        }, MODULE_NAME);
        return response;
    },

    /**
     * Eliminar una unidad de medida por ID
     * @param id - ID de la unidad de medida
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting Measurement', { id }, MODULE_NAME);

        await ApiService.delete(MEASUREMENT_ENDPOINTS.delete(id));

        Logger.info('Measurement deleted successfully', { id }, MODULE_NAME);
    },
};