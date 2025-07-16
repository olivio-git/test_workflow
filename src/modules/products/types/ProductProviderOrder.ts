import { z } from "zod";
import type { ProductProviderOrderSchema } from "../schemas/productProviderOrdersSchema";

export type ProductProviderOrder = z.infer<typeof ProductProviderOrderSchema>;
