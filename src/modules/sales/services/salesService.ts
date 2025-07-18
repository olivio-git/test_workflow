import apiClient from "@/lib/axios";
import type { Sale } from "../types/sale";
import { SALE_ENDPOINTS } from "./endpoints";

export const postSale = async (data: Sale): Promise<any> => {
    const res = await apiClient.post(SALE_ENDPOINTS.all, data)

    return res.data
};
