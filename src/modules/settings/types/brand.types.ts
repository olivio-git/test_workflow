import type z from "zod";
import type { BrandSchema, CreateBrandSchema, GetAllBrandsSchema, GetByIdBrandSchema, UpdateBrandSchema } from "../schemas/brand.schema";
import type { PaginationParams } from "../../shared/types/paginationParams";

export type Brand = z.infer<typeof BrandSchema>
export type GetAllBrands = z.infer<typeof GetAllBrandsSchema>
export type CreateBrand = z.infer<typeof CreateBrandSchema>
export type UpdateBrand = z.infer<typeof UpdateBrandSchema>
export type GetByIdBrand = z.infer<typeof GetByIdBrandSchema>

export interface BrandFilters extends PaginationParams {
    marca?: string
}