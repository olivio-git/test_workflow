import { z } from "zod"
import type { ProductGetSchema } from "../schemas/product.schema"

export type ProductGet = z.infer<typeof ProductGetSchema>
