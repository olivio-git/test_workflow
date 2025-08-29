import type { QuotationFilters } from "../types/quotationFilters.types";
import type { QuotationGetAllResponse, QuotationGetById } from "../types/quotationGet.types";
import { QUOTATION_ENDPOINTS } from "./quotationEndpoints.service";
import { QuotationGetAllResponseSchema } from "../schemas/quotationGet.schema";
import { QuotationGetByIdSchema } from "../schemas/quotationGetById.schema";
import { Logger } from "@/lib/logger";
import { ApiService } from "@/lib/apiService";
import type { QuotationCreate } from "../types/quotationCreate.types";

const MODULE_NAME = 'QUOTATION_SERVICE';

export const quotationService = {
    /**
     * Crear una nueva cotización
     * @param data - Datos de la cotización a crear
    */
    async create(data: QuotationCreate): Promise<unknown> {
        Logger.info('Creating quotation', { data }, MODULE_NAME);

        const response = await ApiService.post(
            QUOTATION_ENDPOINTS.create,
            data,
        );

        Logger.info(
            "Quotation created successfully",
            undefined,
            // response.data.id && { id: response.data.id },
            MODULE_NAME
        );
        return response
    },

    /**
     * Obtener todas las cotizaciones con filtros opcionales
     */
    async getAll(filters: Partial<QuotationFilters>): Promise<QuotationGetAllResponse> {
        Logger.info('Fetching quotations', { filters }, MODULE_NAME);

        const response = await ApiService.get(
            QUOTATION_ENDPOINTS.all,
            QuotationGetAllResponseSchema,
            { params: filters }
        );

        Logger.info('Quotations fetched successfully', {
            count: response.data.length,
        }, MODULE_NAME);

        return response;
    },

    /**
     * Obtener una cotización por ID
     * @param id - ID de la cotización
     */
    async getById(id: number): Promise<QuotationGetById> {
        Logger.info('Fetching quotation detail', { id }, MODULE_NAME);

        const response = await ApiService.get(
            QUOTATION_ENDPOINTS.byId(id),
            QuotationGetByIdSchema,
            undefined,
            { unwrapData: true }
        );

        Logger.info('Quotation detail fetched successfully', { id }, MODULE_NAME);

        return response as QuotationGetById;
    },

    /**
     * Eliminar una cotización por ID
     * @param id - ID de la cotización
     */
    async delete(id: number): Promise<void> {
        Logger.info('Deleting quotation', { id }, MODULE_NAME);

        await ApiService.delete(QUOTATION_ENDPOINTS.delete(id));

        Logger.info('Quotation deleted successfully', { id }, MODULE_NAME);
    },
};