import authSDK from "@/services/sdk-simple-auth";
import axios from "axios";

const BASE_URL = "http://192.168.1.14:8588/api/v1";
const apiClient = axios.create({
    baseURL: BASE_URL,
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
      console.log(error)
        return Promise.reject(error);
    }
);
export default apiClient;