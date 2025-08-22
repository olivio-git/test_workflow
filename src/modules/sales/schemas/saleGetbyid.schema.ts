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
        (val) => {
            if (val === null || val === undefined) return 0; // null o undefined → 0
            if (typeof val === "string") return parseFloat(val); // string → number
            return val; // number → number
        },
        z.number().nonnegative().transform((val) => parseFloat(val.toFixed(5)))
    ),

    porcentaje_descuento: z.preprocess(
        (val) => {
            if (val === null || val === undefined) return 0;
            if (typeof val === "string") return parseFloat(val);
            return val;
        },
        z.number().nonnegative().transform((val) => parseFloat(val.toFixed(5)))
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
    comprobante: z.string().nullable(),
    comprobante2: z.string().nullable(),
    comentarios: z.string().nullable(),
    plazo_pago: z.string().nullable(),
    vehiculo: z.string().nullable(),
    nmotor: z.string().nullable(),
    cliente_nit: z.string().nullable(),
})