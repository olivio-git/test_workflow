import { z } from "zod";

export const ProductProviderOrderSchema = z.object({
    fecha_llegada: z.string(),
    cantidad: z.string().transform(Number),
    costo: z.string().transform(Number),
    nro_pedido: z.number(),
});

export const ProductProviderOrderListSchema = z.array(ProductProviderOrderSchema);
