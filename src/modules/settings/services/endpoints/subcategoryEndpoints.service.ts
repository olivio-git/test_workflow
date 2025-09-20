export const SUBCATEGORY_ENDPOINTS = {
    all: "/subcategories",
    create: "/subcategories",
    byId: (subcategoria: string | number) => `/subcategories/${subcategoria}`,
    update: (id_subcategoria: string | number) => `/subcategories/${id_subcategoria}`,
    delete: (id_subcategoria: string | number) => `/subcategories/${id_subcategoria}`,
  };