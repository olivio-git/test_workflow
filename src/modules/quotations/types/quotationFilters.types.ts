import type { salesFiltersSchema } from "@/modules/sales/schemas/salesFilters.schema";
import type z from "zod";

export type QuotationFilters = z.infer<typeof salesFiltersSchema>