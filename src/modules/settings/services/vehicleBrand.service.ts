import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import type { CreateVehicleBrand, GetAllVehicleBrands, GetByIdVehicleBrand, UpdateVehicleBrand, VehicleBrandFilters } from "../types/vehicleBrand.types";
import { VEHICLE_BRAND_ENDPOINTS } from "./endpoints/vehicleBrandEndpoints.service";
import { GetAllVehicleBrandsSchema, GetByIdVehicleBrandSchema } from "../schemas/vehicleBrand.schema";

const MODULE_NAME = 'VEHICLE_BRAND_SERVICE';

export const vehiclebrandsService = {
    /**
     * Crear una nueva marca de vehiculo
     * @param data - Datos de la marca de vehiculo a crear
     */
    async create(data: CreateVehicleBrand): Promise<GetByIdVehicleBrand> {
        Logger.info('Creating Vehicle Brand', { data }, MODULE_NAME);

        const response = await ApiService.post(
            VEHICLE_BRAND_ENDPOINTS.create,
            data,
            GetByIdVehicleBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info(
            "Vehicle Brand created successfully",
            undefined,
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las marcas de vehiculo con filtros opcionales
     */
    async getAll(filters: Partial<VehicleBrandFilters>): Promise<GetAllVehicleBrands> {
        Logger.info('Fetching Vehicle Brands', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            VEHICLE_BRAND_ENDPOINTS.all,
            GetAllVehicleBrandsSchema,
            { params: filters }
        );

        Logger.info('Vehicle Brands fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una marca de vehiculo por ID
     * @param id - ID de la marca de vehiculo
     */
    async getById(id: number): Promise<GetByIdVehicleBrand> {
        Logger.info('Fetching Vehicle Brand detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            VEHICLE_BRAND_ENDPOINTS.byId(id),
            GetByIdVehicleBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Vehicle Brand detail fetched successfully', {
            id
        }, MODULE_NAME);

        return response;
    },

    /**
     * Actualizar una marca de vehiculo por ID
     * @param id - ID de la marca de vehiculo
     * @param data - Datos para actualizar la marca de vehiculo
     */
    async update(id: number, data: UpdateVehicleBrand): Promise<GetByIdVehicleBrand> {
        Logger.info('Updating Vehicle Brand', { id, data }, MODULE_NAME);

        const response = await ApiService.put(
            VEHICLE_BRAND_ENDPOINTS.update(id),
            data,
            GetByIdVehicleBrandSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Vehicle Brand updated successfully', {
            id
        }, MODULE_NAME);
        return response;
    },

    /**
     * Eliminar una marca de vehiculo por ID
     * @param id - ID de la marca de vehiculo
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting Vehicle Brand', { id }, MODULE_NAME);

        await ApiService.delete(VEHICLE_BRAND_ENDPOINTS.delete(id));

        Logger.info('Vehicle Brand deleted successfully', { id }, MODULE_NAME);
    },
};