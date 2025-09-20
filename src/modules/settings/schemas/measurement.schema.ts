import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";
import z from "zod";

export const MeasurementSchema = z.object({
    id: z.number().nonnegative(),
    unidad_medida: z.string().nonempty()
})

export const GetAllMeasurementsSchema = paginatedResponseSchema(MeasurementSchema)

export const CreateMeasurementSchema = MeasurementSchema.pick({
    unidad_medida: true
})

export const UpdateMeasurementSchema = MeasurementSchema.pick({
    unidad_medida: true
})

export const GetByIdMeasurementSchema = MeasurementSchema.extend({
    codigo_interno: z.number().nonnegative()
})