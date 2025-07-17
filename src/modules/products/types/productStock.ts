import { z } from "zod";
import type { ProductStockSchema } from "../schemas/productStock.schema";

export type ProductStock = z.infer<typeof ProductStockSchema>;
