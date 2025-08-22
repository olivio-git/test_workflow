import type z from "zod";
import type { ProductDetailSchema } from "../schemas/ProductDetail.schema";

export type ProductDetail = z.infer<typeof ProductDetailSchema>;