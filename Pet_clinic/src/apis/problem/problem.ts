// problem.ts
import axios from 'axios';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { ProblemBO } from '@/apis/schemas';

// General result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = 'http://localhost:8084';

// Function to query problems with pagination
export const pageQuery = async (request: ProblemPageRequest): Promise<Result<ProblemPageResponse>> => {
    const response = await axios.get<Result<ProblemPageResponse>>(`${API_BASE_URL}/problem/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update problem information
export const update = async (request: ProblemUpdateRequest): Promise<Result<ProblemBO>> => {
    const response = await axios.post<Result<ProblemBO>>(`${API_BASE_URL}/problem/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
