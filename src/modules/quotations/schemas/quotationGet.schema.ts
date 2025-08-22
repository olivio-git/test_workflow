import { saleGetAllSchema, salesGetAllResponseSchema } from "@/modules/sales/schemas/salesGetAll.schema";
import z from "zod";

export const QuotationGetSchema = saleGetAllSchema
    .omit({ nro_venta: true })
    .extend({
        nro_cotizacion: z.string(),
    })

export const QuotationGetAllResponseSchema = salesGetAllResponseSchema
    .omit({ data: true })
    .extend({
        data: z.array(QuotationGetSchema),
    })