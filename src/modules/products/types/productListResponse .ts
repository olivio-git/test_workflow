import { z } from "zod"
import type { ProductListResponseSchema } from "../schemas/productResponse.schema"

export type ProductListResponse = z.infer<typeof ProductListResponseSchema>
