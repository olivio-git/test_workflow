import type z from "zod";
import type { CreateMeasurementSchema, GetAllMeasurementsSchema, GetByIdMeasurementSchema, MeasurementSchema, UpdateMeasurementSchema } from "../schemas/measurement.schema";
import type { PaginationParams } from "../../shared/types/paginationParams";

export type Measurement = z.infer<typeof MeasurementSchema>
export type GetAllMeasurements = z.infer<typeof GetAllMeasurementsSchema>
export type CreateMeasurement = z.infer<typeof CreateMeasurementSchema>
export type UpdateMeasurement = z.infer<typeof UpdateMeasurementSchema>
export type GetByIdMeasurement = z.infer<typeof GetByIdMeasurementSchema>

export interface MeasurementFilters extends PaginationParams {
    unidad_medida?: string
}