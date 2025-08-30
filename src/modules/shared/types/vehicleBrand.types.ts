import type z from "zod";
import type { VehicleBrandListSchema, VehicleBrandSchema } from "../schemas/vehicleBrands.schema";

export type VehicleBrand = z.infer<typeof VehicleBrandSchema>
export type VehicleBrandList = z.infer<typeof VehicleBrandListSchema>