import apiClient from "@/lib/axios";
import type { ProductFilters } from "../types/productFilters";
import { PRODUCT_ENDPOINTS } from "./endpoints";
import type { ProductListResponse } from "../types/productListResponse ";

export const fetchProducts = async (filters: ProductFilters): Promise<ProductListResponse> => {
    const response = await apiClient.get(PRODUCT_ENDPOINTS.all, {
        params: filters,
    })
    return response.data
}