// department.ts
import axios from 'axios';
import type { DepartmentBO } from '@/apis/schemas';
import type { DepartmentUpdateRequest ,DepartmentPageRequest} from '@/apis/department/department-interface';

// Result 接口定义，根据后端返回的实际结构定义
export interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
    // 可能还有其他字段，如消息文本等
}

// API 基础路径
const API_BASE_URL = '/api';

const department = {
    
}
// 分页查询部门信息
export async function pageQuery(request?:DepartmentPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/department/pageQuery`, request||department);
        return response.data;
    } catch (error) {
        // If there's an error, handle it here
        console.error('Error occurred during the page query:', error);
        throw error; // Re-throw the error after logging or handling it
    }
}
// Async function for updating department information

export async function update(request: DepartmentUpdateRequest): Promise<Result<DepartmentBO>> {
    const response = await axios.post<Result<DepartmentBO>>(`${API_BASE_URL}/department/update`, request);
    return response.data;
}
