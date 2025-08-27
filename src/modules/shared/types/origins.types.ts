import type z from "zod"
import type { OriginListSchema, OriginSchema } from "../schemas/origins.schema"

export type Origins = z.infer<typeof OriginSchema>
export type OriginsList = z.infer<typeof OriginListSchema>