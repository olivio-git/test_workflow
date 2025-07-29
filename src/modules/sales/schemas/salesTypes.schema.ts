import z from "zod";

// export const SaleCodeSchema = z.string().min(1).max(5); // códigos cortos
export const SaleCodeSchema = z.string().min(1).max(5); // códigos cortos
// export const SaleDescriptionSchema = z.string().startsWith('VENTA_'); // descripciones que empiecen con VENTA_
export const SaleDescriptionSchema = z.string();

export const SaleTypesSchema = z.record(SaleCodeSchema, SaleDescriptionSchema);