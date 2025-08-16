import { baseFilterSchema } from "@/modules/shared/schemas/baseFilter.schema";
import { toUndefinedIfEmpty } from "@/utils/zodHelpers";
import z from "zod";

export const productFiltersSchema = baseFilterSchema.extend({
    producto: z.preprocess(toUndefinedIfEmpty, z.number().int().optional()),
    categoria: z.preprocess(toUndefinedIfEmpty, z.number().int().optional()),
    subcategoria: z.preprocess(toUndefinedIfEmpty, z.number().int().optional()),
    descripcion: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    codigo_oem: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    codigo_upc: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    marca: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    modelo: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    medida: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
    nro_motor: z.preprocess(toUndefinedIfEmpty, z.string().optional()),
});