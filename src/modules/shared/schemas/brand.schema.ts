import z from "zod";

export const BrandSchema = z.object({
    id: z.number(),
    marca: z.string(),
});

export const BrandsSchema = z.array(BrandSchema);