import RNBlobUtil from "react-native-blob-util";
import { AxiosResponse } from "axios"; // kept only for compatibility
import { UtilsUrls } from "../../utils/urls";
import { apiClient } from "../../api/axiosInstance"; // only for baseURL / token if needed
import { UserSessionService } from "../../../services/UserSessionService";

class UtilsService {
    public async fileUpload(
        formData: FormData,
        onProgress?: (percent: number) => void
    ): Promise<AxiosResponse<any>> {
        try {
            const parts: any[] = (formData as any)._parts || [];
            let filePart: any = null;
            let fileType = "";
            parts.forEach(([key, value]) => {
                if (key === "file") filePart = value;
                if (key === "file_type") fileType = value;
            });
            if (!filePart?.uri) {
                throw new Error("File is missing in formData");
            }
            const realPath = filePart.uri.startsWith("file://")
                ? filePart.uri.replace("file://", "")
                : filePart.uri;
            const token = await UserSessionService.getAccessToken() || "";
            const stats = await RNBlobUtil.fs.stat(realPath);
            const fileSize = stats.size; // actual file size in bytes
            const response = await RNBlobUtil.fetch(
                "POST",
                `${apiClient.defaults.baseURL}${UtilsUrls.ORG_FILE_UPLOAD}`,
                {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
                [
                    {
                        name: "file",
                        filename: filePart.name || "upload.bin",
                        type: filePart.type || "application/octet-stream",
                        data: RNBlobUtil.wrap(decodeURIComponent(realPath)),
                    },
                    {
                        name: "file_type",
                        data: String(fileType),
                    },
                ]
            ).uploadProgress({ interval: 150 }, (written, total) => {
                const totalBytes = fileSize; // use actual size
                const percent = Math.round((written / totalBytes) * 100);
                onProgress && onProgress(percent);
            })
            const json = response.json();
            return {
                data: json,
                status: response.info().status,
                statusText: "OK",
                headers: response.info().headers,
                config: {},
            } as AxiosResponse;
        } catch (error: any) {
            console.log("UPLOAD ERROR", error);
            throw error;
        }
    }
}

export const utilsService = new UtilsService();
