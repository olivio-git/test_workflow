import { paginatedResponseSchema } from "@/modules/shared/schemas/paginatedResponse.schema";
import z from "zod";

export const VehicleBrandSchema = z.object({
    id: z.number().nonnegative(),
    marca_vehiculo: z.string().nonempty()
})

export const GetAllVehicleBrandsSchema = paginatedResponseSchema(VehicleBrandSchema)

export const CreateVehicleBrandSchema = VehicleBrandSchema.pick({
    marca_vehiculo: true
})

export const UpdateVehicleBrandSchema = VehicleBrandSchema.pick({
    marca_vehiculo: true
})

export const GetByIdVehicleBrandSchema = VehicleBrandSchema.extend({
    codigo_interno: z.number().nonnegative()
})