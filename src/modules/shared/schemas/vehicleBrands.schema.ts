import z from "zod";

export const VehicleBrandSchema = z.object({
    id: z.number(),
    marca_vehiculo: z.string()
})

export const VehicleBrandListSchema = z.array(VehicleBrandSchema)