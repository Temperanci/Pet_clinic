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
const API_BASE_URL = 'http://123.60.5.195:8084';
const diseaseContent = {

}
// 分页查询疾病内容信息
export async function pageQuery(request?:DiseaseContentPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/diseaseContent/pageQuery`, request||diseaseContent);
        return response.data; // 假设后端直接返回 Result<BedPageResponse> 结构
    } catch (error) {
        console.error('page query diseaseContent error', error);
        throw error;
    }
};

export async function update(request: DiseaseContentUpdateRequest) : Promise<Result<DiseaseContentBO>> {
    try {
        const response = await axios.post<Result<DiseaseContentBO>>(`${API_BASE_URL}/diseaseContent/update`, request||diseaseContent);
        return response.data; // 假设后端直接返回 Result<BedBO> 结构
    } catch (error) {
        console.error('update diseaseContent error', error);
        throw error;
    }
};

