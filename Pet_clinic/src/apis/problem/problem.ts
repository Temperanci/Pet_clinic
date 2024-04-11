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
const API_BASE_URL = '/api';

const problem = {
    // type: '',
    // title: '',
    // answer: '',
    // content: '',
    // problemId: '',
    // subjectId: '',
    // background: '',
    // gradingPoints: '',
    currPageNo: 1
}


export async function pageQuery(pageNo:number){
    try {
        problem.currPageNo=pageNo;
        const response = await axios.post(`${API_BASE_URL}/problem/pageQuery`, problem);
        return response.data;
    } catch (error) {
        console.error('Error occurred during the page query:', error);
        throw error; 
    }
}

export async function update(request: ProblemUpdateRequest): Promise<Result<ProblemBO>> {
    const response = await axios.post<Result<ProblemBO>>(`${API_BASE_URL}/problem/update`, request);
    return response.data;
}

