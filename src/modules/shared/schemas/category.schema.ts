import z from "zod";

export const SubcategorySchema = z.object({
    id: z.number(),
    subcategoria: z.string(),
})

export const CategoryWithSubcategoriesSchema = z.object({
    id: z.number(),
    categoria: z.string(),
    subcategorias: z.array(SubcategorySchema).nullable(),
});

export const SubcategoriesSchema = z.array(SubcategorySchema);
export const CategoriesWithSubcategoriesSchema = z.array(CategoryWithSubcategoriesSchema);