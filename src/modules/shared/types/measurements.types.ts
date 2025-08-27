import type z from "zod";
import type { MeasurementListSchema, MeasurementsSchema } from "../schemas/measurements.schema";

export type MeasurementList = z.infer<typeof MeasurementListSchema>;
export type Measurements = z.infer<typeof MeasurementsSchema>;