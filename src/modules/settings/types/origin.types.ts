import type z from "zod";
import type { CreateOriginSchema, GetAllOriginsSchema, GetByIdOriginSchema, OriginSchema, UpdateOriginSchema } from "../schemas/origin.schema";
import type { PaginationParams } from "./paginationParams";

export type Origin = z.infer<typeof OriginSchema>
export type GetAllOrigins = z.infer<typeof GetAllOriginsSchema>
export type CreateOrigin = z.infer<typeof CreateOriginSchema>
export type UpdateOrigin = z.infer<typeof UpdateOriginSchema>
export type GetByIdOrigin = z.infer<typeof GetByIdOriginSchema>

export interface OriginFilters extends PaginationParams {
    procedencia?: string
}