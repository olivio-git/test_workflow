import apiClient from "@/services/axios";
import type { PurchaseFilters } from "../types/purchaseFilters";
import type { PurchaseListResponse } from "../types/purchaseListResponse";
import type { PurchaseDetail } from "../types/PurchaseDetail";
import { PurchaseListResponseSchema } from "../schemas/purchaseResponse.schema";
import { PurchaseDetailResponseSchema } from "../schemas/purchase.schema";
import { PURCHASE_ENDPOINTS } from "./endpoints";
import { ProviderResponseSchema, type ProviderOption } from "../schemas/provider.schema";

export const fetchPurchases = async (filters: PurchaseFilters): Promise<PurchaseListResponse> => {
    // Parámetros por defecto
    const params: any = {
        pagina: filters.pagina || 1,
        pagina_registros: filters.pagina_registros || 10,
        sucursal: filters.sucursal,
    };

    // Agregar parámetros opcionales solo si tienen valor
    if (filters.keywords && filters.keywords.trim()) {
        params.keywords = filters.keywords.trim();
    }
    if (filters.codigo_interno) {
        params.codigo_interno = filters.codigo_interno;
    }
    if (filters.proveedor) {
        params.proveedor = filters.proveedor;
    }
    if (filters.fecha_inicio && filters.fecha_inicio.trim()) {
        params.fecha_inicio = filters.fecha_inicio.trim();
    }
    if (filters.fecha_fin && filters.fecha_fin.trim()) {
        params.fecha_fin = filters.fecha_fin.trim();
    }
    if (filters.codigo_oem_producto && filters.codigo_oem_producto.trim()) {
        params.codigo_oem_producto = filters.codigo_oem_producto.trim();
    }

    console.log("Parámetros enviados:", params);
    
    const response = await apiClient.get(PURCHASE_ENDPOINTS.all, { params });
    console.log("Respuesta recibida:", response.data);
    
    const result = PurchaseListResponseSchema.safeParse(response.data);
    if (!result.success) {
        console.error("Zod error en fetchPurchases:", result.error.format());
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data;
};
export const fetchPurchaseById = async (id: number): Promise<PurchaseDetail> => {
    const response = await apiClient.get(PURCHASE_ENDPOINTS.byId(id));
    
    console.log("Respuesta de fetchPurchaseById:", response.data);
    console.log(response.data);
    const result = PurchaseDetailResponseSchema.safeParse(response.data);
    if (!result.success) {
        console.error("Zod error en fetchPurchaseById:", result.error.format());
        console.error("Datos recibidos:", response.data);
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data.data;
};

export const fetchProviders = async (searchTerm: string = "TODO"): Promise<ProviderOption[]> => {
    const response = await apiClient.get(PURCHASE_ENDPOINTS.providers, {
        params: { proveedor: searchTerm }
    });

    const result = ProviderResponseSchema.safeParse(response.data);
    if (!result.success) {
        console.error("Zod error en fetchProviders:", result.error.format());
        throw new Error("Respuesta inválida del servidor.");
    }
    return result.data.data; // Retornamos solo el array de proveedores
};

export const updatePurchase = async (id: number, data: any): Promise<void> => {
    try {
        console.log('🚀 Enviando datos al servidor:', data);
        const response = await apiClient.put(PURCHASE_ENDPOINTS.update(id), data);
        console.log('✅ Respuesta del servidor:', response.data);
    } catch (error: any) {
        console.error("❌ Error al actualizar compra:", error);
        
        // Mostrar detalles específicos del error de validación
        if (error.response?.status === 422 && error.response?.data?.error?.validation_errors) {
            console.group('🔍 Errores de validación:');
            error.response.data.error.validation_errors.forEach((validationError: any, index: number) => {
                console.log(`${index + 1}. Campo: ${validationError.field} - ${validationError.message}`);
            });
            console.groupEnd();
        }
        
        throw new Error("Error al actualizar la compra");
    }
};

export const deletePurchase = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(PURCHASE_ENDPOINTS.delete(id));
    } catch (error) {
        console.error("Error al eliminar compra:", error);
        throw new Error("Error al eliminar la compra");
    }
};
