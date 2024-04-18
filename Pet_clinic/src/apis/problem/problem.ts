// problem.ts
import axios from 'axios';
import type { ProblemPageRequest, ProblemPageResponse, ProblemUpdateRequest } from '@/apis/problem/problem-interface';
import type { ProblemBO } from '@/apis/schemas';

// General result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = 'http://123.60.5.195:8084';

const temp = {
    currPageNo: 1
}
export async function pageNoQuery(pageNo:number){ //前端分页用的
    try {
        temp.currPageNo=pageNo;
        const response = await axios.post(`${API_BASE_URL}/problem/pageQuery`, temp);
        return response.data;
    } catch (error) {
        console.error('Error occurred during the page query:', error);
        throw error;
    }
}

const problem = {}
export async function pageQuery(request?:ProblemPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/problem/pageQuery`, request||problem);
        return response.data;
    } catch (error) {
        console.error('page query problem error', error);
        throw error;
    }
}

export async function update(request: ProblemUpdateRequest) : Promise<Result<ProblemBO>> {
    try {
        const response = await axios.post<Result<ProblemBO>>(`${API_BASE_URL}/problem/update`, request);
        return response.data;
    } catch (error) {
        console.error('update problem error', error);
        throw error;
    }
};

