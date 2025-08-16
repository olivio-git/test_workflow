import type z from "zod";
import type { productFiltersSchema } from "../schemas/productFilter.schema";

export type ProductFilters = z.infer<typeof productFiltersSchema>;