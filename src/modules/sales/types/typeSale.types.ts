import type z from "zod";
import type { SaleTypesListSchema, SaleTypesResponseSchema, SaleTypesSchema } from "../schemas/salesTypes.schema";

export type SaleTypes = z.infer<typeof SaleTypesSchema>;
export type SaleTypesResponse = z.infer<typeof SaleTypesResponseSchema>
export type SaleTypesList = z.infer<typeof SaleTypesListSchema>;