import { Platform } from "react-native";
import BaseConfig from "../../utils/baseConfig";
import { UserSessionService } from "../../services/UserSessionService";


export const API_HEADERS = {
    'x-api-key': BaseConfig.WEB_API_KEY,
    'device_type': Platform.OS === 'ios' ? 'ios' : 'android',
}

export const getLoggedInApiHeaders = async () =>  {
    const token = await UserSessionService.getAccessToken().then((resp:any) => resp)
    return {
        'x-api-key': BaseConfig.WEB_API_KEY,
        Authorization: `Bearer ${token}`
    }
}

export const getLoggedInMultipartApiHeaders = async () =>  {
    const token = await UserSessionService.getAccessToken().then((resp:any) => resp)
    console.log("token---->", token)
    return {
        'x-api-key': BaseConfig.WEB_API_KEY,
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
    }
}