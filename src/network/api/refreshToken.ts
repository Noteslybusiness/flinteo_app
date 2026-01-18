import axios from "axios";
import BaseConfig from "../../utils/baseConfig";
import { UserSessionService } from "../../services/UserSessionService";

export const refreshTokenApi = async (): Promise<string> => {
    const token = await UserSessionService.getAuthToken();

    if (!token?.refreshToken) {
        throw new Error("No refresh token");
    }

    const response = await axios.post(
        `${BaseConfig.BACKEND_SERVICE}/auth/refresh`,
        { refresh: token.refreshToken }
    );

    await UserSessionService.setAuthToken({
        accessToken: response.data.access,
        refreshToken: response.data.refresh,
    });

    return response.data.access;
};
