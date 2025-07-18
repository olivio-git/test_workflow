import { z } from "zod";

export const SaleDetailSchema = z.object({
  id_producto: z.number(),
  cantidad: z.number().positive(),
  precio: z.number().nonnegative(),
  descuento: z.number().nonnegative(),
  porcentaje_descuento: z.number().nonnegative()
});

export const SaleSchema = z.object({
  fecha: z.string(),
  nro_comprobante: z.string(),
  nro_comprobante2: z.string(),
  id_cliente: z.number(),
  tipo_venta: z.string(),
  forma_venta: z.string(),
  comentario: z.string(),
  plazo_pago: z.string(),
  vehiculo: z.string(),
  nro_motor: z.string(),
  cliente_nombre: z.string(),
  cliente_nit: z.string(),
  usuario: z.number(),
  sucursal: z.number(),
  id_responsable: z.number(),
  detalles: z.array(SaleDetailSchema).nonempty()
});
export const SaleDetailListSchema = z.array(SaleDetailSchema).nonempty()