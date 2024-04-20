// 文件存储请求参数
export interface FileStoreRequest {
    extension: string;
}

// 文件存储响应数据结构
export interface FileStoreResp {
    fileName: string;
    uploadUrl: string;
    downloadUrl: string;
}
