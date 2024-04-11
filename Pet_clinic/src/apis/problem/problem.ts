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
    type: '题目类型',
    title: '题目标题',
    answer: '题目答案',
    content: '题目内容',
    problemId: '题目ID',
    subjectId: '病种ID',
    background: '背景',
    gradingPoints: '分数'
}

// Function to query problems with pagination
export async function pageQuery(){
    try {
        const response = await axios.post(`${API_BASE_URL}/problem/pageQuery`, problem);
        return response.data;
    } catch (error) {
        // If there's an error, handle it here
        console.error('Error occurred during the page query:', error);
        throw error; // Re-throw the error after logging or handling it
    }
}

// Function to update problem information
export async function update(request: ProblemUpdateRequest): Promise<Result<ProblemBO>> {
    const response = await axios.post<Result<ProblemBO>>(`${API_BASE_URL}/problem/update`, request);
    return response.data;
}
