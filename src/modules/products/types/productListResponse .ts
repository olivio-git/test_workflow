import type { ProductGet } from "./ProductGet";

export interface ProductListResponse {
    data: ProductGet[];
    meta: {
        total: number;
    };
}