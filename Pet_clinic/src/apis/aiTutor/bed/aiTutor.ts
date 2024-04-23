// aiTutor.ts
import axios from 'axios';
// import type { AiTutorBO } from "@/apis/schemas";
import type { AiTutorPageRequest, AiTutorPageResponse } from "@/apis/aiTutor/aiTutor-interface";

// Result 接口定义，根据你的实际返回结构来定义
export interface Result<T> {
    success: boolean; // 假设有这样的一个标志
    data: T;
    // 可能还有其他的字段，如错误代码等
}

// 接口地址，根据你的实际后端地址来修改
const API_BASE_URL = 'http://123.60.5.195:8084';
const aiTutor = {

}
export async function pageQuery(request?:AiTutorPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/aiTutor/pageQuery`, request||aiTutor);
        return response.data; // 假设后端直接返回 Result<AiTutorPageResponse> 结构
    } catch (error) {
        console.error('page query aiTutor error', error);
        throw error;
    }
};

// 假设 AiTutorUpdateRequest 和 AiTutorBO 已经定义好了
import type { AiTutorUpdateRequest } from "@/apis/aiTutor/aiTutor-interface";

export async function update(request: AiTutorUpdateRequest) : Promise<Result<AiTutorBO>> {
    try {
        const response = await axios.post<Result<AiTutorBO>>(`${API_BASE_URL}/aiTutor/update`, request);
        return response.data; // 假设后端直接返回 Result<AiTutorBO> 结构
    } catch (error) {
        console.error('update aiTutor error', error);
        throw error;
    }
};
