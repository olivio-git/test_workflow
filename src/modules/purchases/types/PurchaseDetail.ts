import { z } from "zod"
import type { PurchaseDetailSchema } from "../schemas/purchase.schema"

export type PurchaseDetail = z.infer<typeof PurchaseDetailSchema>
