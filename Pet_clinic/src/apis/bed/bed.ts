// bed.ts
import axios from 'axios';
import type { BedBO } from "@/apis/schemas";
import type { BedPageRequest, BedPageResponse } from "@/apis/bed/bed-interface";

// Result 接口定义，根据你的实际返回结构来定义
export interface Result<T> {
    success: boolean; // 假设有这样的一个标志
    data: T;
    // 可能还有其他的字段，如错误代码等
}

// 接口地址，根据你的实际后端地址来修改
const API_BASE_URL = 'http://123.60.5.195:8084';
const bed = {

}
export async function pageQuery(request?:BedPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/bed/pageQuery`, request||bed);
        return response.data; // 假设后端直接返回 Result<BedPageResponse> 结构
    } catch (error) {
        console.error('page query bed error', error);
        throw error;
    }
};

// 假设 BedUpdateRequest 和 BedBO 已经定义好了
import type { BedUpdateRequest } from "@/apis/bed/bed-interface";

export async function update(request: BedUpdateRequest) : Promise<Result<BedBO>> {
    try {
        const response = await axios.post<Result<BedBO>>(`${API_BASE_URL}/bed/update`, request);
        return response.data; // 假设后端直接返回 Result<BedBO> 结构
    } catch (error) {
        console.error('update bed error', error);
        throw error;
    }
};
