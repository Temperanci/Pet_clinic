// department.ts
import axios from 'axios';
import type { DepartmentBO } from '@/apis/schemas';
import type { DepartmentPageRequest, DepartmentPageResponse, DepartmentUpdateRequest } from '@/apis/department/department-interface';

// Result 接口定义，根据后端返回的实际结构定义
interface Result<T> {
    success: boolean;
    data: T;
    // 可能还有其他字段，如消息文本等
}

// API 基础路径
const API_BASE_URL = 'http://localhost:8084';

// 分页查询部门信息
export const pageQuery = async (request: DepartmentPageRequest): Promise<Result<DepartmentPageResponse>> => {
    const response = await axios.get<Result<DepartmentPageResponse>>(`${API_BASE_URL}/department/pageQuery`, {
        params: request,
    });
    return response.data;
};

// 更新部门信息
export const update = async (request: DepartmentUpdateRequest): Promise<Result<DepartmentBO>> => {
    const response = await axios.post<Result<DepartmentBO>>(`${API_BASE_URL}/department/update`, request);
    return response.data;
};
