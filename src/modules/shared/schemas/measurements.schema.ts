import z from "zod";

export const MeasurementsSchema = z.object({
    id: z.number(),
    unidad_medida: z.string(),
});

export const MeasurementListSchema = z.array(MeasurementsSchema);