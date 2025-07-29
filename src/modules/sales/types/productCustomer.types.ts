import type z from "zod"
import type { SaleCustomerListResponseSchema, SaleCustomerSchema } from "../schemas/productCustomer.schema"

export type SaleCustomer = z.infer<typeof SaleCustomerSchema>
export type SaleCustomerListResponse = z.infer<typeof SaleCustomerListResponseSchema>
