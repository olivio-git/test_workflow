import { z } from "zod";
import { SaleResponsibleSchema } from "./saleResponsibles.schema";
import { SaleCustomerGetSchema } from "./saleCustomer.schema";

export const saleGetAllSchema = z.object({
    id: z.number().int(),
    nro_venta: z.string(),
    fecha: z.string(),
    comprobantes: z.string().nullable(),
    contexto: z.string().nullable(),
    cliente: SaleCustomerGetSchema.nullable(),
    responsable: SaleResponsibleSchema.nullable(),
    total: z.number(),
    comentarios: z.string().nullable(),
});

export const salesGetAllResponseSchema = z.object({
    data: z.array(saleGetAllSchema),
    links: z.object({
        first: z.string().nullable(),
        last: z.string().nullable(),
        prev: z.string().nullable(),
        next: z.string().nullable(),
    }).nullable(),
    meta: z.object({
        current_page: z.number().int(),
        from: z.number().int().nullable(),
        last_page: z.number().int(),
        links: z.array(z.object({
            url: z.string().nullable(),
            label: z.string().nullable(),
            active: z.boolean().nullable(),
        })).nullable(),
        path: z.string(),
        per_page: z.number().int(),
        to: z.number().int().nullable(),
        total: z.number().int(),
    }).nullable(),
});