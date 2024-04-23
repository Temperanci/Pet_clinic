// diseaseInstance.ts
import axios from 'axios';
import type { DiseaseInstanceBO } from '@/apis/schemas';
import type { DiseaseInstancePageRequest, DiseaseInstancePageResponse, DiseaseInstanceUpdateRequest } from '@/apis/diseaseInstance/diseaseInstance-interface';

// Define a general result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Assume this is the base URL for your API
const API_BASE_URL = 'http://123.60.5.195:8084';
const diseaseInstance={
    
}
// Function to query disease instances with pagination
export async function pageQuery(request?:DiseaseInstancePageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/diseaseInstance/pageQuery`, request||diseaseInstance);
        return response.data; // 假设后端直接返回 Result<DiseaseInstancePageResponse> 结构
    } catch (error) {
        console.error('page query diseaseInstance error', error);
        throw error;
    }
}

// Function to update disease instance information
export async function update(request: DiseaseInstanceUpdateRequest) : Promise<Result<DiseaseInstanceBO>> {
    try {
        const response = await axios.post<Result<DiseaseInstanceBO>>(`${API_BASE_URL}/diseaseInstance/update`, request);
        return response.data; // 假设后端直接返回 Result<DiseaseInstanceBO> 结构
    } catch (error) {
        console.error('update diseaseInstance error', error);
        throw error;
    }
}
