export interface CategoryResponse {
  data: Category[];
  links: PaginationLinks;
  meta: Meta;
}

export interface Category {
  id: number;
  categoria: string;
  subcategorias: Subcategory[];
}

export interface CategoryDetail {
  id: number;
  categoria: string;
  codigo_interno: number;
}
interface Subcategory {
  id: number;
  subcategoria: string;
  categoria: {
    id: number;
    categoria: string;
    codigo_interno: number;
  };
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: MetaLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface MetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: Meta;
}
