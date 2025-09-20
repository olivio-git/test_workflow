import type z from "zod";
import type { QuotationCreateSchema, QuotationDetailListSchema, QuotationDetailSchema } from "../schemas/quotationCreate.schema";

export type QuotationCreate = z.infer<typeof QuotationCreateSchema>;
export type QuotationDetail = z.infer<typeof QuotationDetailSchema>;
export type QuotationDetailList = z.infer<typeof QuotationDetailListSchema>;