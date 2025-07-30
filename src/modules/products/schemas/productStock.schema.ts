import { z } from "zod";

export const ProductStockSchema = z.object({
    id: z.number(),
    cantidad: z.string().transform(Number),
    costo: z.string().transform(Number),
    precio_venta: z.string().transform(Number),
    precio_venta_alt: z.string().transform(Number),
    saldo: z.string().transform(Number),
    nro_adquisicion: z.number(),
    fecha_adquisicion: z.string(),
    fecha_actualizacion: z.string().nullable(),
    tipo: z.string(),
    sucursal: z.string(),
});

export const ProductStockListSchema = z.array(ProductStockSchema);
