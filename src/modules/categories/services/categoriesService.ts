import { apiConstructor } from "./api";

// Servicios API
const categoriesService = {
  getCategories: async ({ pageParam = 1, categoria = "" }) => {
    let url = `/categories?pagina=${pageParam}&pagina_registros=20`;
    if (categoria.trim()) {
      url += `&categoria=${encodeURIComponent(categoria.trim())}`;
    }

    try {
      const response = await apiConstructor({
        url,
        method: "GET"
      });
      if (Array.isArray(response)) {
        return {
          data: response,
          meta: { total: response.length, current_page: pageParam, last_page: 1 }
        };
      }
      if (response && response.data) {
        return response;
      }
      return { data: [], meta: { total: 0, current_page: 1, last_page: 1 } };
    } catch (error) {
      throw error;
    }
  },

  getCategoriesSimple: async () => {
    try {
      const response = await apiConstructor({
        url: "/categories?pagina=1&pagina_registros=50",
        method: "GET"
      });
      if (Array.isArray(response)) {
        return {
          data: response,
          meta: { total: response.length }
        };
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCategory: async (categoria: string) => {
    return await apiConstructor({
      url: "/categories",
      method: "POST",
      data: { categoria }
    });
  },

  createSubcategory: async (data: { subcategoria: string; categoriaId: number }) => {
    return await apiConstructor({
      url: "/subcategories",
      method: "POST",
      data: {
        subcategoria: data.subcategoria,
        categoria_id: data.categoriaId
      }
    });
  },

  deleteCategory: async (id: number) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "DELETE"
    });
  },

  updateCategory: async (id: number, categoria: string) => {
    return await apiConstructor({
      url: `/categories/${id}`,
      method: "PUT",
      data: { categoria }
    });
  }
};

export default categoriesService;