// testRecord.ts
import axios from 'axios';
import type { TestRecordBO } from '@/apis/schemas';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest } from '@/apis/testRecord/testRecord-interface';

// General result structure for API responses
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API, adjust it to match your actual environment
const API_BASE_URL = 'http://localhost:8084';

// Function to query test records with pagination
export const pageQuery = async (request: TestRecordPageRequest): Promise<Result<TestRecordPageResponse>> => {
    const response = await axios.get<Result<TestRecordPageResponse>>(`${API_BASE_URL}/testRecord/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update test record information
export const update = async (request: TestRecordUpdateRequest): Promise<Result<TestRecordBO>> => {
    const response = await axios.post<Result<TestRecordBO>>(`${API_BASE_URL}/testRecord/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
