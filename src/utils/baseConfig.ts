import { APP_BUILD, BACKEND_SERVICE } from "@env"
import { Platform } from "react-native"



const BaseConfig = {
    APP_BUILD: APP_BUILD ?? 'DEV',
    BACKEND_SERVICE: BACKEND_SERVICE,
    // BACKEND_SERVICE: Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://192.168.0.109:8000',
    WEB_API_KEY: "instalearn"
}

export default BaseConfig
