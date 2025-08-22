import z from "zod";
import { SaleCustomerGetSchema } from "./saleCustomer.schema";
import { SaleResponsibleSchema } from "./saleResponsibles.schema";
import { ProductDetailSchema } from "@/modules/products/schemas/ProductDetail.schema";

export const SaleItemSchema = z.object({
    id: z.number().int(),
    producto: ProductDetailSchema,
    cantidad: z.preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z.number()
    ),
    precio: z.preprocess(
        (val) => (typeof val === "string" ? parseFloat(val) : val),
        z.number().nonnegative().transform((val) => parseFloat(val.toFixed(5)))
    ),
    monenda: z.string(),
    descuento: z.preprocess(
        (val) => (val == null ? null : parseFloat(val as string)),
        z.number().nonnegative().transform((val) => parseFloat(val.toFixed(5))).nullable()
    ),
    porcentaje_descuento: z.preprocess(
        (val) => (val == null ? null : parseFloat(val as string)),
        z.number().nonnegative().transform((val) => parseFloat(val.toFixed(5))).nullable()
    ),
})

export const SaleGetByIdSchema = z.object({
    id: z.number().int(),
    fecha: z.string(),
    nro: z.string(),
    tipo_venta: z.string().nonempty(),
    forma_venta: z.string().nonempty(),
    cliente: SaleCustomerGetSchema.nullable(),
    responsable_venta: SaleResponsibleSchema.nullable(),
    cantidad_detalles: z.number().int(),
    detalles: z.array(SaleItemSchema),
})