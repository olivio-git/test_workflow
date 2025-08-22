import z from "zod";
import { SaleDetailSchema, SaleSchema } from "./sales.schema";

export const SaleUpdateDetailSchema = SaleDetailSchema
    .extend({
        id_detalle_venta: z.number(),
    })

export const SaleUpdateSchema = SaleSchema
    .omit({
        detalles: true
    })
    .extend({
        detalles: z.array(SaleUpdateDetailSchema)
    })