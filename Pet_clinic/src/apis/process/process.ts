import axios from 'axios';
import type { ProcessPageRequest, ProcessPageResponse, ProcessUpdateRequest } from '@/apis/process/process-interface';
import type { ProcessBO } from '@/apis/schemas';
// 定义一个通用的结果结构
export interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
    // 可能还有其他字段，如消息文本等
}
// API 基础路径，确保这是后端服务的正确地址
const API_BASE_URL = 'http://123.60.5.195:8084';
const process = {
    limit: 999
}

// 分页查询流程信息的函数
export async function processPageQuery(request?:ProcessPageRequest){
    try {
        const response = await axios.post<Result<ProcessPageResponse>>(`${API_BASE_URL}/process/pageQuery`, request||process);
        return response.data;
    } catch (error) {
        console.error('Error occurred during the process page query:', error);
        throw error; // 日志记录或处理错误后再次抛出
    }
}

// 更新流程信息的函数
export async function processUpdate(request: ProcessUpdateRequest): Promise<Result<ProcessBO>> {
    try {
        const response = await axios.post<Result<ProcessBO>>(`${API_BASE_URL}/process/update`, request);
        // 同样假设后端返回 Result 类型
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update process');
        }
        return response.data;
    } catch (error) {
        console.error('Error occurred during the process update:', error);
        throw error;
    }
}
