// problemSet.ts
import axios from 'axios';
import type { ProblemSetBO } from '@/apis/schemas';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';

// Define a general result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = 'http://localhost:8084';

// Function to query problem sets with pagination
export const pageQuery = async (request: ProblemSetPageRequest): Promise<Result<ProblemSetPageResponse>> => {
    const response = await axios.get<Result<ProblemSetPageResponse>>(`${API_BASE_URL}/problemSet/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update problem set information
export const update = async (request: ProblemSetUpdateRequest): Promise<Result<ProblemSetBO>> => {
    const response = await axios.post<Result<ProblemSetBO>>(`${API_BASE_URL}/problemSet/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
