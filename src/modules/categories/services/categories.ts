import { apiConstructor } from "@/modules/products/services/api";
import { API_ENDPOINTS } from "./endpoints";

export const getCategories = (page: number, pageSize: number) => {
  return apiConstructor({
    url: API_ENDPOINTS.categories.list(page, pageSize),
    method: "GET",
  });
};
export const createCategory = (categoria:string) => {
  return apiConstructor({
    url: API_ENDPOINTS.categories.create,
    method: "POST",
    data:{categoria:categoria},
  });
};