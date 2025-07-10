import axios from "axios";

const BASE_URL = "http://192.168.1.14:8588/api/v1";
const bearerToken = '29|RgzABuFGPktguTGP177RgL4cv6yaerJUR1p0DhLC8b3022b9'
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
    },

})
export default apiClient;