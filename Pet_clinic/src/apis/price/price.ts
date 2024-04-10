// price.ts
import axios from 'axios';
import type { PriceBO } from '@/apis/schemas';
import type { PricePageRequest, PricePageResponse, PriceUpdateRequest } from '@/apis/price/price-interface';

// Define a general result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// This is the base URL for your API
const API_BASE_URL = 'http://123.60.5.195:8084';

// Function to query prices with pagination
export const pageQuery = async (request: PricePageRequest): Promise<Result<PricePageResponse>> => {
    const response = await axios.get<Result<PricePageResponse>>(`${API_BASE_URL}/price/pageQuery`, {
        params: request,
    });
    return response.data; // Assuming the backend directly returns the Result type
};

// Function to update price information
export const update = async (request: PriceUpdateRequest): Promise<Result<PriceBO>> => {
    const response = await axios.post<Result<PriceBO>>(`${API_BASE_URL}/price/update`, request);
    return response.data; // Assuming the backend directly returns the Result type
};
