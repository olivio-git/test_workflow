import { z } from "zod"

export const ProviderOptionSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    nit: z.string().nullable(),
})

export const ProviderResponseSchema = z.object({
    data: z.array(ProviderOptionSchema),
    links: z.object({
        first: z.string(),
        last: z.string(),
        prev: z.string().nullable(),
        next: z.string().nullable(),
    }),
    meta: z.object({
        current_page: z.number(),
        from: z.number(),
        last_page: z.number(),
        links: z.array(z.object({
            url: z.string().nullable(),
            label: z.string(),
            active: z.boolean(),
        })),
        path: z.string(),
        per_page: z.number(),
        to: z.number(),
        total: z.number(),
    }),
})

export type ProviderOption = z.infer<typeof ProviderOptionSchema>
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>
