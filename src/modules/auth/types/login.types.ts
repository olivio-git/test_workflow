import type z from "zod";
import type { LoginSchema } from "../schemas/login.schema";

export type Login = z.infer<typeof LoginSchema>