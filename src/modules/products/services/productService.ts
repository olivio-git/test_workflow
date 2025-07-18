import apiClient from "@/lib/axios";
import type { ProductFilters } from "../types/productFilters";
import { PRODUCT_ENDPOINTS } from "./endpoints";
import type { ProductListResponse } from "../types/productListResponse ";
import type { ProductDetail } from "../types/productDetail";
import type { ProvOrdersParams, SalesParams, StockParams } from "../types/productDetailParams";
import type { ProductStock } from "../types/productStock";
import { ProductStockListSchema } from "../schemas/productStock.schema";
import type { ProductSalesStats } from "../types/ProductSalesStats";
import { ProductSalesSchema } from "../schemas/productTwoYaersSales.schema";
import type { ProductProviderOrder } from "../types/ProductProviderOrder";
import { ProductProviderOrderListSchema } from "../schemas/productProviderOrdersSchema";
import { ProductListResponseSchema } from "../schemas/productResponse.schema";

export const fetchProducts = async (filters: ProductFilters): Promise<ProductListResponse> => {
    const response = await apiClient.get(PRODUCT_ENDPOINTS.all, {
        params: filters,
    })
    return ProductListResponseSchema.parse(response.data)
}
export const fetchProductDetail = async (id: number): Promise<ProductDetail> => {
    const res = await apiClient.get(PRODUCT_ENDPOINTS.byId(id))
    if (!res.data) {
        throw new Error("Product not found")
    }
    return res.data.data
}
export const fetchProductStock = async ({
    producto,
    sucursal,
    resto_only,
}: StockParams): Promise<ProductStock[]> => {
    const res = await apiClient.get(PRODUCT_ENDPOINTS.stockDetails, {
        params: {
            producto,
            sucursal,
            resto_only,
        },
    });
    return ProductStockListSchema.parse(res.data.data);
};

export const fetchProductProviderOrders = async ({
    producto,
    sucursal,
}: ProvOrdersParams): Promise<ProductProviderOrder[]> => {
    const res = await apiClient.get(PRODUCT_ENDPOINTS.providerOrders, {
        params: {
            producto,
            sucursal
        },
    });
    return ProductProviderOrderListSchema.parse(res.data.data);
};

export const fetchProductSalesStats = async ({
    producto,
    sucursal,
    gestion_1,
    gestion_2,
}: SalesParams): Promise<ProductSalesStats> => {
    const res = await apiClient.get(PRODUCT_ENDPOINTS.twoYearsSales, {
        params: {
            producto,
            sucursal,
            gestion_1,
            gestion_2,
        },
    });
    return ProductSalesSchema.parse(res.data);
};