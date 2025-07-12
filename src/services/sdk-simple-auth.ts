// import { environment } from "@/utils/environment";
import { AuthSDK } from "sdk-simple-auth";

const authSDK = new AuthSDK({
    authServiceUrl: "http://192.168.1.14:8588/api/v1",
    // authServiceUrl: environment.apiUrl || "http://192.168.1.14:8588/api/v1",
    endpoints: {
        login: "/login",
        logout: "/logout"
    },
    storage: {
        type: "indexedDB",
        dbName: "tps-intermotors",
        storeName: "auth",
        dbVersion: 1,
        tokenKey: "tps-intermotors_auth_token",
        userKey: "tps-intermotors_auth_user",
        refreshTokenKey: "tps-intermotors_auth_refresh_token",
    },
    tokenRefresh: {
        enabled: false,
    }
})

export default authSDK;