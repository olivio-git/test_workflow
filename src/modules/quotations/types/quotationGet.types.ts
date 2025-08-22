import type z from "zod";
import type { QuotationGetAllResponseSchema, QuotationGetSchema } from "../schemas/quotationGet.schema";
import type { QuotationGetByIdSchema, QuotationItemSchema } from "../schemas/quotationGetById.schema";

export type QuotationGetAllResponse = z.infer<typeof QuotationGetAllResponseSchema>
export type QuotationGetAll = z.infer<typeof QuotationGetSchema>

// tipos para cotizacion por id
export type QuotationGetById = z.infer<typeof QuotationGetByIdSchema>
export type QuotationItemGetById = z.infer<typeof QuotationItemSchema>