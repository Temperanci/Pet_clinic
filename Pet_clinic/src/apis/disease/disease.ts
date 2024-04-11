// disease.ts
import axios from 'axios';
import type { DiseaseBO } from '@/apis/schemas';
import type { DiseasePageResponse, DiseaseUpdateRequest } from '@/apis/disease/disease-interface';

// 定义一个通用的结果类型，你可能需要根据实际的后端响应格式调整这个定义
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// 假设这是你的API的基础URL
const API_BASE_URL = '/api';
const disease = {}

// 分页查询疾病信息
export async function DiseasePageQuery(){
    try {
        const response = await axios.post<Result<DiseasePageResponse>>(`${API_BASE_URL}/disease/pageQuery`, disease);
        return response.data;
    } catch (error) {
        // If there's an error, handle it here
        console.error('Error occurred during the disease page query:', error);
        throw error; // Re-throw the error after logging or handling it
    }
}

// 更新疾病信息
export const update = async (request: DiseaseUpdateRequest): Promise<Result<DiseaseBO>> => {
    const response = await axios.post<Result<DiseaseBO>>(`${API_BASE_URL}/disease/update`, request);
    return response.data; // 假设后端直接返回Result类型
};
