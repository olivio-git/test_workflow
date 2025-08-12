import { z } from "zod";

export const SaleResponsibleSchema = z.object({
    id: z.number(),
    nombre: z.string(),
});

export const SaleResponsibleListResponseSchema = z.array(SaleResponsibleSchema)
