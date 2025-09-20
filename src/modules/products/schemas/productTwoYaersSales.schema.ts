import { z } from "zod";

const toNumber = z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    return val;
}, z.number());

export const ProductSalesItemSchema = z.object({
    mes: z.string(),
    gestion_1: toNumber,
    gestion_2: toNumber,
});

export const ProductSalesMetaSchema = z.object({
    getion_1: z.string(),
    getion_2: z.string(),
});

export const ProductSalesSchema = z.object({
    data: z.array(ProductSalesItemSchema),
    meta: ProductSalesMetaSchema,
});
