import axios from "axios";
import BaseConfig from "../../utils/baseConfig";
import { UserSessionService } from "../../services/UserSessionService";
import { refreshTokenApi } from "./refreshToken";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const apiClient = axios.create({
    baseURL: BaseConfig.BACKEND_SERVICE,
    timeout: 30000,
});

/** Attach Access Token */
apiClient.interceptors.request.use(
    async (config) => {
        const token = await UserSessionService.getAuthToken();
        if (token?.accessToken) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
        return config;
    },
    Promise.reject
);

/** Refresh Token on 401 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                    });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const newToken = await refreshTokenApi();
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                await UserSessionService.logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
