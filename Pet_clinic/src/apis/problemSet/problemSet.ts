// problemSet.ts
import axios from 'axios';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemSetBO } from '@/apis/schemas';

// General result structure
// General result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = '/api';

const temp = {
    currPageNo: 1
}

export async function pageNoQuery(pageNo:number){ //前端分页用的
    try {
        temp.currPageNo=pageNo;
        const response = await axios.post(`${API_BASE_URL}/problemSet/pageQuery`, problemSet);
        return response.data;
    } catch (error) {
        console.error('Error occurred during the pageSet query:', error);
        throw error; 
    }
}

const problemSet = {}
export async function pageQuery(request?:ProblemSetPageRequest){
    try {
        const response = await axios.post(`${API_BASE_URL}/problemSet/pageQuery`, request||problemSet);
        return response.data;
    } catch (error) {
        console.error('page query problemSet error', error);
        throw error;
    }
}

export async function update(request: ProblemSetUpdateRequest) : Promise<Result<ProblemSetBO>> {
    try {
        const response = await axios.post<Result<ProblemSetBO>>(`${API_BASE_URL}/problemSet/update`, request);
        return response.data;
    } catch (error) {
        console.error('update problemSet error', error);
        throw error;
    }
};
