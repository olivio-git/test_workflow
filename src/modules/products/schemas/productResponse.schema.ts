import { z } from "zod"
import { ProductGetSchema } from "./product.schema"

export const ProductListResponseSchema = z.object({
    data: z.array(ProductGetSchema),
    meta: z.object({
        total: z.number(),
    }),
})
