import authSDK from "@/services/sdk-simple-auth";
import { environment } from "@/utils/environment";
import axios from "axios";

// const BASE_URL = "http://192.168.1.14:8588/api/v1";
const apiClient = axios.create({
    baseURL: environment.apiUrl,
    headers: {
        "Content-Type": "application/json",
    },

})
apiClient.interceptors.request.use(
    async (config) => {
        const token = await authSDK.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default apiClient;