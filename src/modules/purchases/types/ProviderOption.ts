import { z } from "zod"
import type { ProviderOptionSchema } from "../schemas/provider.schema"

export type ProviderOption = z.infer<typeof ProviderOptionSchema>
