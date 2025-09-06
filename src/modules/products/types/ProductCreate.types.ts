import type z from "zod";
import type { ProductCreateSchema } from "../schemas/productCreate.schema";

export type ProductCreate = z.infer<typeof ProductCreateSchema>