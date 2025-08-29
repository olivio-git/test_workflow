import z from "zod";
import { QuotationCreateSchema, QuotationDetailSchema } from "./quotationCreate.schema";

export const QuotationUpdateDetailSchema = QuotationDetailSchema
    .extend({
        id_detalle_cotizacion: z.number().nullable(),
    })

export const QuotationUpdateSchema = QuotationCreateSchema
    .omit({
        detalles: true,
    })
    .extend({
        detalles: z.array(QuotationUpdateDetailSchema)
    })