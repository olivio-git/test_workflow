import { apiConstructor } from "@/modules/products/services/api";
import { API_ENDPOINTS } from "./endpoints";

export const getSubCategories = () => {
  return apiConstructor({
    url: API_ENDPOINTS.subcategories.all,
    method: "GET",
  });
};
export const createSubCategory = (data: { categoria: string }) => {
  return apiConstructor({
    url: API_ENDPOINTS.subcategories.create,
    method: "POST",
    data,
  });
};