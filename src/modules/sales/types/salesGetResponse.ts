import type z from "zod";
import type { saleGetAllSchema, salesGetAllResponseSchema } from "../schemas/salesGetAll.schema";
import type { SaleCustomerGetSchema } from "../schemas/saleCustomer.schema";
import type { SaleResponsibleSchema } from "../schemas/saleResponsibles.schema";
import type { SaleGetByIdSchema, SaleItemSchema } from "../schemas/saleGetbyid.schema";

export type SaleCustomerGetAll = z.infer<typeof SaleCustomerGetSchema>;
export type SaleResponsibleGetAll = z.infer<typeof SaleResponsibleSchema>;
export type SaleGetAll = z.infer<typeof saleGetAllSchema>;
export type SalesGetAllResponse = z.infer<typeof salesGetAllResponseSchema>;

// tipos para venta por id

export type SaleGetById = z.infer<typeof SaleGetByIdSchema>
export type SaleItemGetById = z.infer<typeof SaleItemSchema>