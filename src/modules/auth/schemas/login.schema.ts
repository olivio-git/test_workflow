import z from "zod";

export const LoginSchema = z.object({
    usuario: z.string().nonempty().min(3),
    clave: z.string().nonempty().min(3)
})