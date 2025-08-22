import apiClient from "@/lib/axios";
import type { Sale } from "../types/sale";
import { SALE_ENDPOINTS } from "./saleEndpoints";
import type { SalesFilters } from "../types/salesFilters";
import type { SaleGetById, SalesGetAllResponse } from "../types/salesGetResponse";
import { salesGetAllResponseSchema } from "../schemas/salesGetAll.schema";
import { SaleGetByIdSchema } from "../schemas/saleGetbyid.schema";

export const postSale = async (data: Sale): Promise<any> => {
    const res = await apiClient.post(SALE_ENDPOINTS.create, data)
    console.log("Respuesta del servidor al crear la venta:", res.data);
    return res.data
};

export const fetchSales = async (filters: Partial<SalesFilters>): Promise<SalesGetAllResponse> => {
    const response = await apiClient.get(SALE_ENDPOINTS.all, { params: filters });

    const result = salesGetAllResponseSchema.safeParse(response.data);
    if (!result.success) {
        console.error("Zod error en fetchSales:", result.error.format());
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data;
};

/**
 * Obtener una venta por ID
 * @param idSale - ID de la venta a obtener
 */
export const fetchSaleDetail = async (idSale: number): Promise<SaleGetById> => {
    const response = await apiClient.get(SALE_ENDPOINTS.byId(idSale));
    const result = SaleGetByIdSchema.safeParse(response.data.data);
    if (!result.success) {
        console.error("Zod error en fetchSaleDetail:", result.error.format());
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data;
};

/**
 * Elimina una venta por ID
 * @param idSale - ID de la venta a eliminar
 */
export const deleteSale = async (idSale: number): Promise<void> => {
    try {
        await apiClient.delete(SALE_ENDPOINTS.delete(idSale));

    } catch (error: any) {
        if (error.response?.data?.error?.message) {
            console.error("Error eliminando venta:", error.response.data.error.message);
            throw new Error(error.response.data.error.message);
        }
        throw new Error("Error eliminando la venta.");
    }
};