import type z from "zod";
import type { CategorySchema, CreateCategorySchema, GetAllCategoriesSchema, GetByIdCategorySchema, UpdateCategorySchema } from "../schemas/category.schema";
import type { PaginationParams } from "./paginationParams";

export type Category = z.infer<typeof CategorySchema>
export type GetAllCategories = z.infer<typeof GetAllCategoriesSchema>
export type CreateCategory = z.infer<typeof CreateCategorySchema>
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>
export type GetByIdCategory = z.infer<typeof GetByIdCategorySchema>

export interface CategoryFilters extends PaginationParams {
    categoria?: string
    codigo_interno?: number
}