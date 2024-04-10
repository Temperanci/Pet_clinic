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

// Function to query disease instances with pagination
export const pageQuery = async (request: DiseaseInstancePageRequest): Promise<Result<DiseaseInstancePageResponse>> => {
    const response = await axios.get<Result<DiseaseInstancePageResponse>>(`${API_BASE_URL}/diseaseInstance/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update disease instance information
export const update = async (request: DiseaseInstanceUpdateRequest): Promise<Result<DiseaseInstanceBO>> => {
    const response = await axios.post<Result<DiseaseInstanceBO>>(`${API_BASE_URL}/diseaseInstance/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
