import type z from "zod"
import type { SaleProductDetailSchema, SaleUpdateDetailSchema, SaleUpdateDetailUISchema, SaleUpdateFormSchema, SaleUpdateSchema } from "../schemas/saleUpdate.schema"

export type SaleUpdate = z.infer<typeof SaleUpdateSchema>
export type SaleUpdateDetail = z.infer<typeof SaleUpdateDetailSchema>

// Para la UI (venta completa)
export type SaleUpdateDetailUI = z.infer<typeof SaleUpdateDetailUISchema>
export type SaleUpdateForm = z.infer<typeof SaleUpdateFormSchema>
export type SaleProductDetailUI = z.infer<typeof SaleProductDetailSchema>