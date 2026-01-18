import { AxiosResponse } from "axios";
import { apiClient } from "../../api/axiosInstance";
import { NotificationUrls } from "../../utils/urls";


class NotificationService {
    public async get_notfication_feeds(config: any): Promise<AxiosResponse> {
        return await apiClient.get(NotificationUrls.NOTIFICATION_FEEDS, {
            params: config
        });
    }
}

export const notificationService = new NotificationService();