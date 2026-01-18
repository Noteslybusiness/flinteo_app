import { AxiosResponse } from "axios";
import { apiClient } from "../../api/axiosInstance";
import { OrganizationUrls } from "../../utils/urls";

class OrganizationService {

    public async getOrgDetailsRepo<T>(config?: any): Promise<AxiosResponse<T>> {
        return apiClient.get(OrganizationUrls.ORG_USER_PROFILE_DETAILS, { params: config });
    }

    public async updateOrgDetails<T>(config: any): Promise<AxiosResponse<T>> {
        return apiClient.put(OrganizationUrls.ORG_USER_PROFILE_DETAILS, config);
    }

    public async getOrgUsers<T>(config: any): Promise<AxiosResponse<T>> {
        return apiClient.get(OrganizationUrls.ORG_USERS, { params: config });
    }

    public async addOrgUsers<T>(config: any): Promise<AxiosResponse<T>> {
        return apiClient.post(OrganizationUrls.ORG_USERS, config);
    }

    public async updateOrgUser<T>(config: any): Promise<AxiosResponse<T>> {
        return apiClient.put(OrganizationUrls.ORG_USERS, config);
    }

    public async deleteOrgUser<T>(config: any): Promise<AxiosResponse<T>> {
        return apiClient.delete(OrganizationUrls.ORG_USERS, { data: config });
    }
}

export const organizationService = new OrganizationService();

