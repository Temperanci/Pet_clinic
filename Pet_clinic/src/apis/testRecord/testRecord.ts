// testRecord.ts
import axios from 'axios';
import type { TestRecordBO } from '@/apis/schemas';
import type { TestRecordPageRequest, TestRecordPageResponse, TestRecordUpdateRequest } from '@/apis/testRecord/testRecord-interface';

// General result structure for API responses
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API, adjust it to match your actual environment
const API_BASE_URL = '/api';

const testRecord = {}
export async function pageQuery(request?:TestRecordPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/testRecord/pageQuery`, request||testRecord);
        return response.data;
    } catch (error) {
        console.error('page query testRecord error', error);
        throw error;
    }
}

export async function update(request: TestRecordUpdateRequest) : Promise<Result<TestRecordBO>> {
    try {
        const response = await axios.post<Result<TestRecordBO>>(`${API_BASE_URL}/testRecord/update`, request);
        // console.log("提交测试记录:",request);
        return response.data;
    } catch (error) {
        console.error('update testRecord error', error);
        throw error;
    }
};
