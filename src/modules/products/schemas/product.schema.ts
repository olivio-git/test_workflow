import { z } from "zod"

export const ProductGetSchema = z.object({
    id: z.number(),
    descripcion: z.string(),
    codigo_oem: z.string().nullable(),
    codigo_upc: z.string().nullable(),
    modelo: z.string().nullable(),
    medida: z.string().nullable(),
    nro_motor: z.string().nullable(),
    categoria: z.string(),
    subcategoria: z.string(),
    marca: z.string(),
    procedencia: z.string(),
    unidad_medida: z.string(),
    stock_actual: z.string().transform(Number),
    stock_resto: z.string().transform(Number),
    pedido_transito: z.string().transform(Number),
    pedido_almacen: z.string().transform(Number),
    precio_venta: z.string().transform(Number),
    precio_venta_alt: z.string().transform(Number),
    sucursal: z.string(),
})
