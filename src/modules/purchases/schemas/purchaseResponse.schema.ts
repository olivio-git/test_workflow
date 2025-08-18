import { z } from "zod"
import { PurchaseGetSchema } from "./purchaseList.schema"

export const PurchaseListResponseSchema = z.object({
    data: z.array(PurchaseGetSchema),
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
