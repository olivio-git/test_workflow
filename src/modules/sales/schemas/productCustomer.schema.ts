import { z } from "zod"

export const SaleCustomerSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    nit: z.number().nullable(),
})

export const SaleCustomerListResponseSchema = z.object({
    data: z.array(SaleCustomerSchema),
    links: z.object({
        first: z.string(),
        last: z.string(),
        prev: z.string().nullable(),
        next: z.string().nullable(),
    }),
    meta: z.object({
        current_page: z.number(),
        from: z.number().nullable(),
        last_page: z.number(),
        links: z.array(
            z.object({
                url: z.string().nullable(),
                label: z.string(),
                active: z.boolean(),
            })
        ),
        path: z.string(),
        per_page: z.number(),
        to: z.number().nullable(),
        total: z.number(),
    }),
})
