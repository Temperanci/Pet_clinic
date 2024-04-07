// bed.ts
import axios from 'axios';
import type { BedBO } from "@/apis/schemas";
import type { BedPageRequest, BedPageResponse } from "@/apis/bed/bed-interface";

// Result 接口定义，根据你的实际返回结构来定义
interface Result<T> {
    success: boolean; // 假设有这样的一个标志
    data: T;
    // 可能还有其他的字段，如错误代码等
}

// 接口地址，根据你的实际后端地址来修改
const API_BASE_URL = 'http://localhost:8084';

export const pageQuery = async (request: BedPageRequest): Promise<Result<BedPageResponse>> => {
    try {
        const response = await axios.get<Result<BedPageResponse>>(`${API_BASE_URL}/bed/pageQuery`, {
            params: request
        });
        return response.data; // 假设后端直接返回 Result<BedPageResponse> 结构
    } catch (error) {
        console.error('page query bed error', error);
        throw error;
    }
};

// 假设 BedUpdateRequest 和 BedBO 已经定义好了
import type { BedUpdateRequest } from "./path/to/BedUpdateRequest";

export const update = async (request: BedUpdateRequest): Promise<Result<BedBO>> => {
    try {
        const response = await axios.post<Result<BedBO>>(`${API_BASE_URL}/bed/update`, request);
        return response.data; // 假设后端直接返回 Result<BedBO> 结构
    } catch (error) {
        console.error('update bed error', error);
        throw error;
    }
};