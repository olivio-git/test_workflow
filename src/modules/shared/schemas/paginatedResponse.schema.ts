import { z } from "zod";

const linksSchema = z.object({
    first: z.string().nullable(),
    last: z.string().nullable(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
}).nullable();

const metaSchema = z.object({
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
}).nullable();

/**
 * Genera un schema de respuesta paginada para cualquier entidad.
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        links: linksSchema,
        meta: metaSchema,
    });