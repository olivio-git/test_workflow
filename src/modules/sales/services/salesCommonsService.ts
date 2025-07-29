import apiClient from "@/lib/axios"
import { SALECOMMONS_ENDPOINTS } from "./saleCommonsEndpoints"
import type { SaleTypes } from "../types/typeSale"
import { SaleTypesSchema } from "../schemas/salesTypes.schema"
import type { SaleModalities } from "../types/modalitiesSale"
import type { SaleResponsibleListResponse } from "../types/saleResponsible"
import { SaleResponsibleListResponseSchema } from "../schemas/saleResponsibles.schema"
import type { SaleCustomerListResponse } from "../types/productCustomer.types"
import { SaleCustomerListResponseSchema } from "../schemas/productCustomer.schema"

export const fetchSaleTypes = async (): Promise<SaleTypes> => {
    const response = await apiClient.get(SALECOMMONS_ENDPOINTS.types)
    const result = SaleTypesSchema.safeParse(response.data)

    if (!result.success) {
        console.error("Zod error en fetchSaleTypes:", result.error.format())
        throw new Error("Respuesta inválida del servidor (tipos-venta).")
    }

    return result.data
}

export const fetchSaleModalities = async (): Promise<SaleModalities> => {
    const response = await apiClient.get(SALECOMMONS_ENDPOINTS.modalities)
    const result = SaleTypesSchema.safeParse(response.data)

    if (!result.success) {
        console.error("Zod error en fetchSaleModalities:", result.error.format())
        throw new Error("Respuesta inválida del servidor (modalidad-venta).")
    }

    return result.data
}

export const fetchSaleResponsibles = async (): Promise<SaleResponsibleListResponse> => {
    const response = await apiClient.get(SALECOMMONS_ENDPOINTS.responsibles)
    const result = SaleResponsibleListResponseSchema.safeParse(response.data.data)

    if (!result.success) {
        console.error("Zod error en fetchSaleResponsibles:", result.error.format())
        throw new Error("Respuesta inválida del servidor (responsables-venta).")
    }

    return result.data
}

export const fetchSaleCustomers = async (cliente?: string): Promise<SaleCustomerListResponse> => {
    const response = await apiClient.get(SALECOMMONS_ENDPOINTS.customers,
        {
            params: cliente ? { cliente } : {},
        }
    )
    const result = SaleCustomerListResponseSchema.safeParse(response.data)

    if (!result.success) {
        console.error("Zod error en fetchSaleCustomers:", result.error.format())
        throw new Error("Respuesta inválida del servidor (clientes-venta).")
    }

    return result.data
}

export const convertToOptions = (ventaTypes: SaleTypes) => {
    return Object.entries(ventaTypes).map(([code, description]) => ({
        value: code,
        label: description,
        code,
        description,
    }));
}