import type z from "zod";
import type { ProductUpdateSchema } from "../schemas/productUpdate.schema";

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>