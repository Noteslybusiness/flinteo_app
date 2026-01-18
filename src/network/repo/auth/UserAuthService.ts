import axios, { AxiosInstance, AxiosResponse } from "axios";
import BaseConfig from "../../../utils/baseConfig";
import { AuthUrls } from "../../utils/urls";


export class UserAuthService {
    private axiosInstance: AxiosInstance;

    constructor(header?:any){
        this.axiosInstance = axios.create({
            baseURL: BaseConfig.BACKEND_SERVICE,
            timeout: 20000,
            headers: {
                ...header,
            }
        })
    }

    public async postOtpSendRepo<T>(config: any): Promise<AxiosResponse> {
        const response = await this.axiosInstance.post(AuthUrls.SEND_OTP, config)
        return response
    }

    public async postUserLoginRepo<T>(config: any): Promise<AxiosResponse> {
        const response = await this.axiosInstance.post(AuthUrls.USER_LOGIN, config)
        return response
    }

    public async getUserProfileRepo<T>(config: any): Promise<AxiosResponse> {
        const response = await this.axiosInstance.get(AuthUrls.USER_PROFILE, {params: config})
        return response
    }
}