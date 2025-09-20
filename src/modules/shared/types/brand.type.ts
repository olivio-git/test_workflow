import type z from "zod";
import type { BrandSchema, BrandsSchema } from "../schemas/brand.schema";

export type Brand = z.infer<typeof BrandSchema>
export type Brands = z.infer<typeof BrandsSchema>