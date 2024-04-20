// API 基础路径
import type {FileStoreRequest, FileStoreResp} from "@/apis/fileStore/fileStore-interface";
import axios from "axios";

export interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

const API_BASE_URL = 'http://123.60.5.195:8084';

// 请求上传文件的链接
export async function requestUploadLink(request: FileStoreRequest) {
    try {
        const response = await axios.post<Result<FileStoreResp>>(`${API_BASE_URL}/fileStore/request`, request);
        if (response.data.success) {
            return response.data.data; // 返回成功响应的数据部分
        } else {
            throw new Error(response.data.message || "Unknown error occurred during file upload request.");
        }
    } catch (error) {
        console.error('Error occurred during the file upload request:', error);
        throw error; // Re-throw the error after logging or handling it
    }
}
