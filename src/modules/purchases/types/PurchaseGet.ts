import { z } from "zod"
import type { PurchaseGetSchema } from "../schemas/purchase.schema"

export type PurchaseGet = z.infer<typeof PurchaseGetSchema>
