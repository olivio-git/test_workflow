import type z from "zod";
import type { salesFiltersSchema } from "../schemas/salesFilters.schema";

export type SalesFilters = z.infer<typeof salesFiltersSchema>