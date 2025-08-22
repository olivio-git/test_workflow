import { z } from "zod";

export const SaleResponsibleSchema = z.object({
    id: z.number().int(),
    nombre: z.string(),
    apellido_paterno: z.string().nullable().optional(),
    apellido_materno: z.string().nullable().optional(),
    dni: z.number().int().nullable().optional(),
    celular: z.string().nullable().optional(),
});

export const SaleResponsibleListResponseSchema = z.array(SaleResponsibleSchema)
