import { z } from "zod";

export const ProductSalesItemSchema = z.object({
    mes: z.string(),
    gestion_1: z.string().transform(Number),
    gestion_2: z.string().transform(Number),
});

export const ProductSalesMetaSchema = z.object({
    getion_1: z.string(),
    getion_2: z.string(),
});

export const ProductSalesSchema = z.object({
    data: z.array(ProductSalesItemSchema),
    meta: ProductSalesMetaSchema,
});
