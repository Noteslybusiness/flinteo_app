import { AxiosResponse } from "axios";
import { apiClient } from "../../api/axiosInstance";
import { ContentUrls } from "../../utils/urls";


class ContentService {
    public async getContentFieldOptions(): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.CONTENT_FIELD_OPTIONS);
    }
    
    public async getVideoContent(slug: string): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.VIDEO_CONTENT, {
            params: {
                slug: slug
            }
        });
    }

    public async createVideoContent(data: any): Promise<AxiosResponse> {
        return await apiClient.post(ContentUrls.VIDEO_CONTENT, data);
    }

    public async updateVideoContent(data: any): Promise<AxiosResponse> {
        return await apiClient.put(ContentUrls.VIDEO_CONTENT, data);
    }

    public async deleteVideoContent(data: any): Promise<AxiosResponse> {
        return await apiClient.delete(ContentUrls.VIDEO_CONTENT, data);
    }

    public async getCourseContent(slug: string): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.COURSE_CONTENT, {
            params: {
                slug: slug
            }
        });
    }

    public async createCourseContent(data: any): Promise<AxiosResponse> {
        return await apiClient.post(ContentUrls.COURSE_CONTENT, data);
    }

    public async updateCourseContent(data: any): Promise<AxiosResponse> {
        return await apiClient.put(ContentUrls.COURSE_CONTENT, data);
    }

    public async deleteCourseContent(data: any): Promise<AxiosResponse> {
        return await apiClient.delete(ContentUrls.COURSE_CONTENT, data)
    }

    public async getContentList(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.CONTENT_LIST, {
            params: config
        });
    }

    public async getUnPublishedContents(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.UNPUBLISHED_CONTENT_LIST, {
            params: config
        });
    }

    public async getMostViewedContent(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.MOST_VIEWED_CONTENT, {
            params: config
        });
    }

    public async getRecentContent(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.RECENT_CONTENT, {
            params: config
        });
    }

    public async getExploreContent(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.EXPLORE_CONTENT_LIST, {
            params: config
        });
    }

    public async getExploreFilters(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.EXPLORE_CONTENT_FILTERS, {
            params: config
        });
    }

    public async getContentInsights(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.CONTENT_INSIGHTS, {
            params: config
        });
    }
    
    public async userGroupShare(data: any): Promise<AxiosResponse> {
        return await apiClient.post(ContentUrls.USER_GROUP_SHARE, data);
    }

    public async getUserFeedsContent(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.USER_FEEDS_CONTENT, {
            params: config
        });
    }

    public async getUserSharedContent(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.USER_SHARED_CONTENT, {
            params: config
        });
    }

    public async getMySharedCourses(config: any): Promise<AxiosResponse> {
        return await apiClient.get(ContentUrls.MY_SHARED_COURSED, {
            params: config
        });
    }

    public async postUserContentAction(config: any): Promise<AxiosResponse> {
        return await apiClient.post(ContentUrls.POST_USER_CONTENT_ACTION, config);
    }
}

export const contentService = new ContentService();