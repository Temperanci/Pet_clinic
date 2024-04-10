// disease.ts
import axios from 'axios';
import type { DiseaseBO } from '@/apis/schemas';
import type { DiseasePageRequest, DiseasePageResponse, DiseaseUpdateRequest } from '@/apis/disease/disease-interface';

// 定义一个通用的结果类型，你可能需要根据实际的后端响应格式调整这个定义
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// 假设这是你的API的基础URL
const API_BASE_URL = 'http://123.60.5.195:8084';

// 分页查询疾病信息
export const pageQuery = async (request: DiseasePageRequest): Promise<Result<DiseasePageResponse>> => {
    const response = await axios.get<Result<DiseasePageResponse>>(`${API_BASE_URL}/disease/pageQuery`, {
        params: request,
    });
    return response.data; // 假设后端直接返回Result类型
};

// 更新疾病信息
export const update = async (request: DiseaseUpdateRequest): Promise<Result<DiseaseBO>> => {
    const response = await axios.post<Result<DiseaseBO>>(`${API_BASE_URL}/disease/update`, request);
    return response.data; // 假设后端直接返回Result类型
};
