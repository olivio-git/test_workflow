import z from "zod";

export const baseFilterSchema = z.object({
    pagina: z.coerce.number().int().default(1),
    pagina_registros: z.coerce.number().int().default(25),
    sucursal: z.coerce.number()
})