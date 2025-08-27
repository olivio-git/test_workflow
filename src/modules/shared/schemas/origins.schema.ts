import z from "zod"

export const OriginSchema = z.object({
    id: z.number(),
    procedencia: z.string(),
})
export const OriginListSchema = z.array(OriginSchema);