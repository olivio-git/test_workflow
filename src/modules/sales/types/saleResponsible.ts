import type z from "zod"
import type { SaleResponsibleListResponseSchema, SaleResponsibleSchema } from "../schemas/saleResponsibles.schema"

export type SaleResponsible = z.infer<typeof SaleResponsibleSchema>
export type SaleResponsibleListResponse = z.infer<typeof SaleResponsibleListResponseSchema>