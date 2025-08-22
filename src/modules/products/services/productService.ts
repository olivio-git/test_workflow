import apiClient from "@/lib/axios";
import type { ProductFilters } from "../types/productFilters";
import { PRODUCT_ENDPOINTS } from "./endpoints";
import type { ProductDetail } from "../types/productDetail";
import type { ProvOrdersParams, SalesParams, StockParams } from "../types/productDetailParams";
import type { ProductStock } from "../types/productStock";
import { ProductStockListSchema } from "../schemas/productStock.schema";
import type { ProductSalesStats } from "../types/ProductSalesStats";
import { ProductSalesSchema } from "../schemas/productTwoYaersSales.schema";
import type { ProductProviderOrder } from "../types/ProductProviderOrder";
import { ProductProviderOrderListSchema } from "../schemas/productProviderOrdersSchema";
import { ProductListResponseSchema } from "../schemas/productResponse.schema";
import type { ProductListResponse } from "../types/productListResponse ";
import { ProductDetailSchema } from "../schemas/ProductDetail.schema";

export const fetchProducts = async (filters: Partial<ProductFilters>): Promise<ProductListResponse> => {
	const response = await apiClient.get(PRODUCT_ENDPOINTS.all, { params: filters });

	const result = ProductListResponseSchema.safeParse(response.data);
	if (!result.success) {
		console.error("Zod error en fetchProducts:", result.error.format());
		throw new Error("Respuesta inválida del servidor.");
	}
	return result.data;
};

export const fetchProductDetail = async (id: number): Promise<ProductDetail> => {
	const response = await apiClient.get(PRODUCT_ENDPOINTS.byId(id));
	const result = ProductDetailSchema.safeParse(response.data.data);
	if (!result.success) {
		console.error("Zod error en fetchProductDetail:", result.error.format());
		throw new Error("Respuesta inválida del servidor.");
	}
	return result.data;
};

export const fetchProductStock = async ({
	producto,
	sucursal,
	resto_only,
}: StockParams): Promise<ProductStock[]> => {
	const res = await apiClient.get(PRODUCT_ENDPOINTS.stockDetails, {
		params: { producto, sucursal, resto_only },
	});

	const result = ProductStockListSchema.safeParse(res.data.data);
	if (!result.success) {
		console.error("Zod error en fetchProductStock:", result.error.format());
		throw new Error("Respuesta inválida del servidor.");
	}
	return result.data;
};

export const fetchProductProviderOrders = async ({
	producto,
	sucursal,
}: ProvOrdersParams): Promise<ProductProviderOrder[]> => {
	const res = await apiClient.get(PRODUCT_ENDPOINTS.providerOrders, {
		params: { producto, sucursal },
	});

	const result = ProductProviderOrderListSchema.safeParse(res.data.data);
	if (!result.success) {
		console.error("Zod error en fetchProductProviderOrders:", result.error.format());
		throw new Error("Respuesta inválida del servidor.");
	}
	return result.data;
};

export const fetchProductSalesStats = async ({
	producto,
	sucursal,
	gestion_1,
	gestion_2,
}: SalesParams): Promise<ProductSalesStats> => {
	const res = await apiClient.get(PRODUCT_ENDPOINTS.twoYearsSales, {
		params: { producto, sucursal, gestion_1, gestion_2 },
	});

	const result = ProductSalesSchema.safeParse(res.data);
	if (!result.success) {
		console.error("Zod error en fetchProductSalesStats:", result.error.format());
		throw new Error("Respuesta inválida del servidor.");
	}
	return result.data;
};

/**
 * Elimina un producto por ID
 * @param productId - ID del producto a eliminar
 */
export const deleteProduct = async (productId: number): Promise<void> => {
	try {
		await apiClient.delete(PRODUCT_ENDPOINTS.delete(productId));

	} catch (error: any) {
		if (error.response?.data?.error?.message) {
			console.error("Error eliminando producto:", error.response.data.error.message);
			throw new Error(error.response.data.error.message);
		}
		throw new Error("Error eliminando el producto.");
	}
};