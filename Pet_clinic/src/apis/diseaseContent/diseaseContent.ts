// diseaseContent.ts
import axios from 'axios';
import type { DiseaseContentBO } from '@/apis/schemas';
import type { DiseaseContentPageRequest, DiseaseContentPageResponse, DiseaseContentUpdateRequest } from '@/apis/diseaseContent/diseaseContent-interface';

// 通用的结果类型定义，根据后端返回的实际结构来定义
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// 假设这是你的API的基础URL
const API_BASE_URL = '/api';

// 分页查询疾病内容信息
export const pageQuery = async (request: DiseaseContentPageRequest): Promise<Result<DiseaseContentPageResponse>> => {
    const response = await axios.get<Result<DiseaseContentPageResponse>>(`${API_BASE_URL}/diseaseContent/pageQuery`, {
        params: request,
    });
    return response.data; // 假设后端直接返回Result类型
};

// 更新疾病内容信息
export const update = async (request: DiseaseContentUpdateRequest): Promise<Result<DiseaseContentBO>> => {
    const response = await axios.post<Result<DiseaseContentBO>>(`${API_BASE_URL}/diseaseContent/update`, request);
    return response.data; // 假设后端直接返回Result类型
};
