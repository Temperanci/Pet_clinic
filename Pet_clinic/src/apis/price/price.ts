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
const API_BASE_URL = '/api';
const price = {
    desc:'描述',
    type:'服务类型',
    price:'价格',
    title:'服务名称',
    priceId:'价格编号',
    serviceId:'服务编号',
    departmentId:'科室编号'
}
// Function to query prices with pagination
export async function pageQuery(request?:PricePageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/price/pageQuery`, request||price);
        return response.data; // 假设后端直接返回 Result<BedPageResponse> 结构
    } catch (error) {
        console.error('page query price error', error);
        throw error;
    }
};

// Function to update price information
export async function update(request: PriceUpdateRequest) : Promise<Result<PriceBO>> {
    try {
        const response = await axios.post<Result<PriceBO>>(`${API_BASE_URL}/price/update`, request);
        return response.data; // 假设后端直接返回 Result<BedBO> 结构
    } catch (error) {
        console.error('update price error', error);
        throw error;
    }
};
