import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";
import z from "zod";

export const BrandSchema = z.object({
    id: z.number().nonnegative(),
    marca: z.string().nonempty()
})

export const GetAllBrandsSchema = paginatedResponseSchema(BrandSchema)

export const CreateBrandSchema = BrandSchema.pick({
    marca: true
})

export const UpdateBrandSchema = BrandSchema.pick({
    marca: true
})

export const GetByIdBrandSchema = BrandSchema.extend({
    codigo_interno: z.number().nonnegative()
})