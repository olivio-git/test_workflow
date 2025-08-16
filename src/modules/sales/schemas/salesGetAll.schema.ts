import { z } from "zod";

export const customerGetAllSchema = z.object({
    id: z.number().int(),
    cliente: z.string(),
    direccion: z.string().nullable(),
    nit: z.number().nullable(),
    contacto: z.string().nullable(),
});

export const responsibleGetAllSchema = z.object({
    id: z.number().int(),
    nombre: z.string(),
    apellido_paterno: z.string().nullable(),
    apellido_materno: z.string().nullable(),
    dni: z.number().int().nullable(),
    celular: z.string().nullable(),
});

export const saleGetAllSchema = z.object({
    id: z.number().int(),
    nro_venta: z.string(),
    fecha: z.string(),
    comprobantes: z.string().nullable(),
    contexto: z.string().nullable(),
    cliente: customerGetAllSchema.nullable(),
    responsable: responsibleGetAllSchema.nullable(),
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
    }),
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
        to: z.number().int(),
        total: z.number().int(),
    }),
});