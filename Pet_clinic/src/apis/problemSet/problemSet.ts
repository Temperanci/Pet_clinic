// problem.ts
import axios from 'axios';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemSetBO } from '@/apis/schemas';

// General result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = '/api';

// Function to query problems with pagination
export const pageQuery = async (request: ProblemSetPageRequest): Promise<Result<ProblemSetPageResponse>> => {
    const response = await axios.get<Result<ProblemSetPageResponse>>(`${API_BASE_URL}/problemSet/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update problem information
export const update = async (request: ProblemSetUpdateRequest): Promise<Result<ProblemSetBO>> => {
    const response = await axios.post<Result<ProblemSetBO>>(`${API_BASE_URL}/problemSet/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
