// drug.ts
import axios from 'axios';
import type { DrugBO } from '@/apis/schemas';
import type { DrugPageRequest, DrugPageResponse, DrugUpdateRequest } from '@/apis/drug/drug-interface';

// Define a general result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// This is the base URL for your API
const API_BASE_URL = 'http://123.60.5.195:8084';
const drug ={
}
// Function to query drugs with pagination
export async function pageQuery(request?:DrugPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/drug/pageQuery`, request||drug);
        return response.data; // 假设后端直接返回 Result<BedPageResponse> 结构
    } catch (error) {
        console.error('page query bed error', error);
        throw error;
    }
};
// Function to update drug information
export async function update(request: DrugUpdateRequest) : Promise<Result<DrugBO>> {
    try {
        const response = await axios.post<Result<DrugBO>>(`${API_BASE_URL}/drug/update`, request);
        return response.data; // 假设后端直接返回 Result<BedBO> 结构
    } catch (error) {
        console.error('update bed error', error);
        throw error;
    }
};

