import { z } from "zod";

const toNumber = z.preprocess((val) => {
    if (typeof val === "string") return Number(val);
    return val;
}, z.number());

export const ProductProviderOrderSchema = z.object({
    fecha_llegada: z.string(),
    cantidad: toNumber,
    costo: toNumber,
    nro_pedido: z.number(),
});

export const ProductProviderOrderListSchema = z.array(ProductProviderOrderSchema);
