import { z } from "zod";
import { SaleResponsibleSchema } from "./saleResponsibles.schema";
import { SaleCustomerGetSchema } from "./saleCustomer.schema";
import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";

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

export const salesGetAllResponseSchema = paginatedResponseSchema(saleGetAllSchema)