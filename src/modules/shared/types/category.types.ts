import type z from "zod";
import type { CategoriesWithSubcategoriesSchema, CategoryWithSubcategoriesSchema, SubcategoriesSchema, SubcategorySchema } from "../schemas/category.schema";

export type Subcategory = z.infer<typeof SubcategorySchema>
export type Subcategories = z.infer<typeof SubcategoriesSchema>
export type CategoryWithSubcategories = z.infer<typeof CategoryWithSubcategoriesSchema>
export type CategoriesWithSubcategories = z.infer<typeof CategoriesWithSubcategoriesSchema>