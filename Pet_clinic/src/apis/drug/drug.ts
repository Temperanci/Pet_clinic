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
const API_BASE_URL = 'http://localhost:8084';

// Function to query drugs with pagination
export const pageQuery = async (request: DrugPageRequest): Promise<Result<DrugPageResponse>> => {
    const response = await axios.get<Result<DrugPageResponse>>(`${API_BASE_URL}/drug/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update drug information
export const update = async (request: DrugUpdateRequest): Promise<Result<DrugBO>> => {
    const response = await axios.post<Result<DrugBO>>(`${API_BASE_URL}/drug/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
