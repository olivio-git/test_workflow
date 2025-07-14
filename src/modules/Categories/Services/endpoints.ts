export const API_ENDPOINTS = {
  categories: {
    list: (page: number, size: number) =>
      `/categories?pagina=${page}&pagina_registros=${size}`,
    create: "/categories",
    byId: (id: number | string) => `/categories/${id}`,
  },
  subcategories: {
    all: "/subcategories",
    byCategoryId: (id: string | number) => `/categories/${id}/subcategories`,
    create: "/subcategories",
  },
};
