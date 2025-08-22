import apiClient from "@/lib/axios";
import type { QuotationFilters } from "../types/quotationFilters.types";
import type { QuotationGetAllResponse } from "../types/quotationGet.types";
import { QUOTATION_ENDPOINTS } from "./quotationEndpoints.service";
import { QuotationGetAllResponseSchema } from "../schemas/quotationGet.schema";

export const fetchQuotations = async (filters: Partial<QuotationFilters>): Promise<QuotationGetAllResponse> => {
    const response = await apiClient.get(QUOTATION_ENDPOINTS.all, { params: filters });

    const result = QuotationGetAllResponseSchema.safeParse(response.data);
    if (!result.success) {
        console.error("Zod error en fetchQuotations:", result.error.format());
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data;
};

/**
 * Elimina una cotizacion por ID
 * @param idQuotation - ID de la cotizacion a eliminar
 */
export const deleteQuotation = async (idQuotation: number): Promise<void> => {
    try {
        await apiClient.delete(QUOTATION_ENDPOINTS.delete(idQuotation));

    } catch (error: any) {
        if (error.response?.data?.error?.message) {
            console.error("Error eliminando cotizacion:", error.response.data.error.message);
            throw new Error(error.response.data.error.message);
        }
        throw new Error("Error eliminando la cotizacion.");
    }
};