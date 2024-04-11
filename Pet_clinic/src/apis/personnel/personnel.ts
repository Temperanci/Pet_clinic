// personnel.ts
import axios from 'axios';
import type { PersonnelBO } from '@/apis/schemas';
import type { PersonnelPageRequest, PersonnelPageResponse, PersonnelUpdateRequest } from '@/apis/personnel/personnel-interface';

// Result 接口定义，根据后端返回的实际结构定义
export interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
    // 可能还有其他字段，如消息文本等
}

// API 基础路径
const API_BASE_URL = '/api';
const personnel = {
    name: '人事名称',
    role: '人事角色',
    status: '人事状态',
    password: '人事密码',
    personnelId: '人事ID',
    phoneNumber: '人事电话号码',
    departmentId: '部门ID',
}
// 分页查询人事信息
export async function PersonnelPageQuery(){
    try {
        const response = await axios.post(`${API_BASE_URL}/personnel/pageQuery`, personnel);
        return response.data;
    } catch (error) {
        // 处理错误
        console.error('Error occurred during the personnel page query:', error);
        throw error; // 日志记录或处理错误后再次抛出
    }
}

// 更新人事信息的异步函数
export async function update(request: PersonnelUpdateRequest): Promise<Result<PersonnelBO>> {
    try {
        const response = await axios.post<Result<PersonnelBO>>(`${API_BASE_URL}/personnel/update`, request);
        return response.data;
    } catch (error) {
        // 处理错误
        console.error('Error occurred during the personnel update:', error);
        throw error; // 日志记录或处理错误后再次抛出
    }
}
