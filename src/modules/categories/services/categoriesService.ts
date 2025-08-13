import { apiConstructor } from "./api";

// Servicios API
const categoriesService = {
  // Renamed 'pageParam' to 'page' to match the parameter passed by useQuery
  getCategories: async ({ page = 1, categoria = "", perPage = 10 }) => {
    let url = `/categories?pagina=${page}&pagina_registros=${perPage}`;
    if (categoria.trim()) {
      url += `&categoria=${encodeURIComponent(categoria.trim())}`;
    }
    const response = await apiConstructor({ url, method: "GET" });

    if (response && response.data && response.meta) {
      return response;
    } else if (Array.isArray(response)) {
      return {
        data: response,
        meta: {
          total: response.length,
          current_page: page,
          last_page: 1,
        },
      };
    }

    return { data: [], meta: { total: 0, current_page: 1, last_page: 1 } };
  },


  getCategoriesSimple: async () => {
    const response = await apiConstructor({
      url: "/categories?pagina=1&pagina_registros=50",
      method: "GET",
    });
    if (Array.isArray(response)) {
      return {
        data: response,
        meta: { total: response.length },
      };
    }
    return response;
  },

  createCategory: async (categoria: string) => {
    return await apiConstructor({
      url: "/categories",
      method: "POST",
      data: { categoria },
    });
  },

  createSubcategory: async (data: {
    subcategoria: string;
    categoriaId: number;
  }) => {
    return await apiConstructor({
      url: "/subcategories",
      method: "POST",
      data: {
        subcategoria: data.subcategoria,
        categoria_id: data.categoriaId,
      },
    });
  },

  deleteCategory: async (id: number) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "DELETE",
    });
  },

  updateCategory: async (id: number, categoria: string) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "PUT",
      data: { categoria },
    });
  },
};

export default categoriesService;
