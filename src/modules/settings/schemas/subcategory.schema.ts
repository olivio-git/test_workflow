import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";
import z from "zod";
import { CategorySchema } from "./category.schema";

export const SubcategorySchema = z.object({
    id: z.number(),
    subcategoria: z.string(),
    categoria: CategorySchema.pick({
        id: true,
        categoria: true
    }).extend({
        codigo_interno: z.number().nonnegative()
    }).nullable()
})

export const GetAllSubcategoriesSchema = paginatedResponseSchema(SubcategorySchema)

export const CreateSubcategorySchema = SubcategorySchema.pick({
    subcategoria: true
})

export const UpdateSubcategorySchema = SubcategorySchema.pick({
    subcategoria: true
})

export const GetByIdSubcategorySchema = SubcategorySchema.extend({
    codigo_interno: z.number().nonnegative()
})