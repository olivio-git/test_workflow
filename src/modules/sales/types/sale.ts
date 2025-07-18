import { z } from "zod";
import type { SaleDetailListSchema, SaleDetailSchema, SaleSchema } from "../schemas/sales.schema";

export type Sale = z.infer<typeof SaleSchema>;
export type SaleDetail = z.infer<typeof SaleDetailSchema>;
export type SaleDetailList = z.infer<typeof SaleDetailListSchema>
