import type z from "zod";
import type { CreateVehicleBrandSchema, GetAllVehicleBrandsSchema, GetByIdVehicleBrandSchema, UpdateVehicleBrandSchema, VehicleBrandSchema } from "../schemas/vehicleBrand.schema";
import type { PaginationParams } from "../../shared/types/paginationParams";

export type VehicleBrand = z.infer<typeof VehicleBrandSchema>
export type GetAllVehicleBrands = z.infer<typeof GetAllVehicleBrandsSchema>
export type CreateVehicleBrand = z.infer<typeof CreateVehicleBrandSchema>
export type UpdateVehicleBrand = z.infer<typeof UpdateVehicleBrandSchema>
export type GetByIdVehicleBrand = z.infer<typeof GetByIdVehicleBrandSchema>

export interface VehicleBrandFilters extends PaginationParams {
    marca_vehiculo?: string
}