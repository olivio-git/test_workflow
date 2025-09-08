import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";
import z from "zod";

export const OriginSchema = z.object({
    id: z.number().nonnegative(),
    procedencia: z.string().nonempty()
})

export const GetAllOriginsSchema = paginatedResponseSchema(OriginSchema)

export const CreateOriginSchema = OriginSchema.pick({
    procedencia: true
})

export const UpdateOriginSchema = OriginSchema.pick({
    procedencia: true
})

export const GetByIdOriginSchema = OriginSchema.extend({
    codigo_interno: z.number().nonnegative()
})