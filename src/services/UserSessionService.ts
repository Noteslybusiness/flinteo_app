import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserType = "admin" | "creator" | "viewer";

export interface UserProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile_number: string;
    role_id: number;
    role_name: UserType;
}

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
}

const STORAGE_KEYS = {
    AUTH_TOKEN: "APP_AUTH_TOKEN",
    USER_PROFILE: "APP_USER_PROFILE",
} as const;

export const UserSessionService = {

    async setAuthToken(token: AuthToken): Promise<void> {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEYS.AUTH_TOKEN,
                JSON.stringify(token)
            );
        } catch (error) {
            console.error("Error saving auth token:", error);
        }
    },

    async getAuthToken(): Promise<AuthToken | null> {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error reading auth token:", error);
            return null;
        }
    },

    async getAccessToken(): Promise<string | null> {
        const token = await this.getAuthToken();
        return token?.accessToken ?? null;
    },

    async getRefreshToken(): Promise<string | null> {
        const token = await this.getAuthToken();
        return token?.refreshToken ?? null;
    },

    async isAuthenticated(): Promise<boolean> {
        const accessToken = await this.getAccessToken();
        return Boolean(accessToken);
    },

    async setUserProfile(profile: UserProfile): Promise<void> {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEYS.USER_PROFILE,
                JSON.stringify(profile)
            );
        } catch (error) {
            console.error("Error saving user profile:", error);
        }
    },

    async getUserProfile(): Promise<UserProfile | null> {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error reading user profile:", error);
            return null;
        }
    },

    async logout(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                STORAGE_KEYS.AUTH_TOKEN,
                STORAGE_KEYS.USER_PROFILE,
            ]);
        } catch (error) {
            console.error("Error clearing session:", error);
        }
    },
};
