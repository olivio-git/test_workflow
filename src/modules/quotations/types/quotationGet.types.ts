import type z from "zod";
import type { QuotationGetAllResponseSchema, QuotationGetSchema } from "../schemas/quotationGet.schema";

export type QuotationGetAllResponse = z.infer<typeof QuotationGetAllResponseSchema>
export type QuotationGetAll = z.infer<typeof QuotationGetSchema>