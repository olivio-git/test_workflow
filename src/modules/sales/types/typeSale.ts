import type z from "zod";
import type { SaleCodeSchema, SaleDescriptionSchema, SaleTypesSchema } from "../schemas/salesTypes.schema";

export type SaleCode = z.infer<typeof SaleCodeSchema>;
export type SaleDescription = z.infer<typeof SaleDescriptionSchema>;
export type SaleTypes = z.infer<typeof SaleTypesSchema>;

// Tipo para las entradas del objeto (útil para mapear)
export type SaleEntry = [SaleCode, SaleDescription];