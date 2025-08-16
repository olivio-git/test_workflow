import type z from "zod";
import type { customerGetAllSchema, responsibleGetAllSchema, saleGetAllSchema, salesGetAllResponseSchema } from "../schemas/salesGetAll.schema";

export type CustomerGetAll = z.infer<typeof customerGetAllSchema>;
export type ResponsibleGetAll = z.infer<typeof responsibleGetAllSchema>;
export type SaleGetAll = z.infer<typeof saleGetAllSchema>;
export type SalesGetAllResponse = z.infer<typeof salesGetAllResponseSchema>;