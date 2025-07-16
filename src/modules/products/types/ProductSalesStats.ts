import { z } from "zod";
import type { ProductSalesItemSchema, ProductSalesSchema } from "../schemas/productTwoYaersSales.schema";

export type ProductSalesStats = z.infer<typeof ProductSalesSchema>;
export type ProductSalesItem = z.infer<typeof ProductSalesItemSchema>;
