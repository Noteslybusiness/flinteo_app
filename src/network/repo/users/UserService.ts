import { AxiosResponse } from "axios";
import { apiClient } from "../../api/axiosInstance";
import { ContentUrls, OrganizationUrls } from "../../utils/urls";


class UserService {
    public async getUserProfile(): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.USER_PROFILE);
    }

    public async getUsersList(): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_USERS);
    }

    public async addUser(data: any): Promise<AxiosResponse> {
        return await apiClient.post(OrganizationUrls.ORG_USERS, data);
    }

    public async deleteUser(config: any): Promise<AxiosResponse> {
        return await apiClient.delete(OrganizationUrls.ORG_USERS, {
            data: config
        });
    }

    public async getViewerList(config?: any): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_VIEWER_USERS, {
            params: config
        });
    }

    public async getUserKpis(config?: any): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_USER_KPIS, {
            params: config
        });
    }

      public async getBlockKpis(config?: any): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_BLOCK_KPIS, {
            params: config
        });
    }

}

class UserGroupService {
    public async getUserGroups(): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_USER_GROUPS);
    }

    public async addUserGroup(data: any): Promise<AxiosResponse> {
        return await apiClient.post(OrganizationUrls.ORG_USER_GROUPS, data);
    }

    public async updateUserGroup(data: any): Promise<AxiosResponse> {
        return await apiClient.put(OrganizationUrls.ORG_USER_GROUPS, data);
    }

    public async deleteUserGroup(data: any): Promise<AxiosResponse> {
        return await apiClient.delete(OrganizationUrls.ORG_USER_GROUPS, {
            data: data
        });
    }

    public async getUserGroupInfo(id: string): Promise<AxiosResponse> {
        return await apiClient.get(OrganizationUrls.ORG_USER_GROUPS_MAPPINGS, {
            params: {
                group_id: id
            }
        })
    }

    public async updateUserGroupMapping(payload: any): Promise<AxiosResponse> {
        return await apiClient.post(OrganizationUrls.ORG_USER_GROUPS_MAPPINGS, payload);
    }

}

export const userService = new UserService();

export const userGroupService = new UserGroupService();