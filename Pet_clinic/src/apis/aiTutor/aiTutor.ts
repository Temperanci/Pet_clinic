// aiTutor.ts
import axios from 'axios';
import type { AiTutorBO } from "@/apis/schemas";
import type { AiTutorQuestionRequest, AiTutorResponse } from "@/apis/aiTutor/aiTutor-interface";

export interface Result<T> {
    success: boolean;
    data: T;
}

// 接口地址，根据你的实际后端地址来修改
const API_BASE_URL = 'http://123.60.5.195:8084';
const aiTutor = {

}
export async function answerQuestion(request?:AiTutorQuestionRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/aiTutor/answerQuestion`, request||aiTutor);
        return response.data; // 假设后端直接返回 Result<AiTutorPageResponse> 结构
    } catch (error) {
        console.error('aiTutor answerQuestion error', error);
        throw error;
    }
};




// export async function update(request: AiTutorUpdateRequest) : Promise<Result<AiTutorBO>> {
//     try {
//         const response = await axios.post<Result<AiTutorBO>>(`${API_BASE_URL}/aiTutor/update`, request);
//         return response.data; // 假设后端直接返回 Result<AiTutorBO> 结构
//     } catch (error) {
//         console.error('update aiTutor error', error);
//         throw error;
//     }
// };
