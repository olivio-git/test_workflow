import axios from 'axios';
axios.defaults.baseURL = environment.apiUrl;
import authSDK from '@/services/sdk-simple-auth';
import { environment } from '@/utils/environment';

interface ApiConstructor {
    url: string;
    method?: string;
    data?: any;
    params?: any;
    headers?: any;
}
export const apiConstructor = async ({
    url,
    method = "GET",
    data,
    params,
    headers
}: ApiConstructor) => {
    try { 
        const token = await authSDK.getAccessToken();
        //console.log(token)
        const config = {
            url,
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                ...headers
            },
            ...(data && method !== "GET" && method !== "DELETE" && { data }),
            ...(params && { params }) // Añadido manejo de params
        };
        const response = await axios(config); 
        return response.data
    } catch (error: any) {
        console.error('API Error:', error);
        throw error.response?.data || error.message || 'Unknown error';
    }
}