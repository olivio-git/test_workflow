import apiClient from "@/lib/axios";
import type { Sale } from "../types/sale";
import { SALE_ENDPOINTS } from "./saleEndpoints";
import type { SalesFilters } from "../types/salesFilters";
import type { SalesGetAllResponse } from "../types/salesGetAllResponse";
import { salesGetAllResponseSchema } from "../schemas/salesGetAll.schema";

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

// export const fetchSaleDetail = async (id: number): Promise<ProductDetail> => {
//     const response = await apiClient.get(SALE_ENDPOINTS.byId(id));
//     const result = ProductDetailSchema.safeParse(response.data.data);
//     if (!result.success) {
//         console.error("Zod error en fetchProductDetail:", result.error.format());
//         throw new Error("Respuesta inválida del servidor.");
//     }
//     return result.data;
// };