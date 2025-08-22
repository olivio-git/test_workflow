import type z from "zod"
import type { SaleUpdateDetailSchema, SaleUpdateSchema } from "../schemas/saleUpdate.schema"
import type { ProductGet } from "@/modules/products/types/ProductGet";
import type { ProductDetail } from "@/modules/products/types/productDetail";
import type { SaleItemGetById } from "./salesGetResponse";

export type SaleUpdate = z.infer<typeof SaleUpdateSchema>
export type SaleUpdateDetail = z.infer<typeof SaleUpdateDetailSchema>

export type SaleUpdateDetailWithProduct = Omit<SaleItemGetById, "producto"> & {
    producto: ProductGet | ProductDetail;
};
