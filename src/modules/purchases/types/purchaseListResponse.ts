import { z } from "zod"
import type { PurchaseListResponseSchema } from "../schemas/purchaseResponse.schema"

export type PurchaseListResponse = z.infer<typeof PurchaseListResponseSchema>
