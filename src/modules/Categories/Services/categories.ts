import { API_ENDPOINTS } from "../Services/endpoints";
import { apiConstructor } from "@/modules/products/services/api";

export const getCategories = (page: number, pageSize: number) => {
  return apiConstructor({
    url: API_ENDPOINTS.categories.list(page, pageSize),
    method: "GET",
  });
};
export const createCategory = (data: { categoria: string }) => {
  return apiConstructor({
    url: API_ENDPOINTS.categories.create,
    method: "POST",
    data,
  });
};