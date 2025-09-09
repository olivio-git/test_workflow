import type z from "zod";
import type { CreateSubcategorySchema, GetAllSubcategoriesSchema, GetByIdSubcategorySchema, SubcategorySchema, UpdateSubcategorySchema } from "../schemas/subcategory.schema";
import type { PaginationParams } from "../../shared/types/paginationParams";

export type Subcategory = z.infer<typeof SubcategorySchema>
export type GetAllSubcategories = z.infer<typeof GetAllSubcategoriesSchema>
export type CreateSubcategory = z.infer<typeof CreateSubcategorySchema>
export type UpdateSubcategory = z.infer<typeof UpdateSubcategorySchema>
export type GetByIdSubcategory = z.infer<typeof GetByIdSubcategorySchema>

export interface SubcategoryFilters extends PaginationParams {
    subcategoria?: string
    categoria?: number
}