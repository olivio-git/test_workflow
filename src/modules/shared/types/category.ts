export interface Subcategoria {
    id: number;
    subcategoria: string;
}

export interface CategoriaConSubcategorias {
    id: number;
    categoria: string;
    subcategorias: Subcategoria[];
}
