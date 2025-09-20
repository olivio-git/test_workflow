import type z from "zod";
import type { QuotationUpdateDetailSchema, QuotationUpdateSchema } from "../schemas/quotationUpdate.schema";

export type QuotationUpdateDetail = z.infer<typeof QuotationUpdateDetailSchema>;
export type QuotationUpdate = z.infer<typeof QuotationUpdateSchema>;