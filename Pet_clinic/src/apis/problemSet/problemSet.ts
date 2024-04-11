// problemSet.ts
import axios from 'axios';
import type { ProblemSetPageRequest, ProblemSetPageResponse, ProblemSetUpdateRequest } from '@/apis/problemSet/problemSet-interface';
import type { ProblemSetBO } from '@/apis/schemas';

// General result structure
interface Result<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Base URL for your API
const API_BASE_URL = '/api';

const problemSet = {
    desc: '描述',
    title: '试卷题目',
    endTime: '0',
    duration: '0',
    startTime: '0',
    whiteList: '列表',
    problemSetId: '试卷ID',
    problemIdList: '试卷题目列表',
    problemScoreMap: '试卷题目分数',
    currPageNo: 1
}

export async function pageQuery(pageNo:number){
    try {
        problemSet.currPageNo=pageNo;
        const response = await axios.post(`${API_BASE_URL}/problemSet/pageQuery`, problemSet);
        return response.data;
    } catch (error) {
        console.error('Error occurred during the page query:', error);
        throw error; 
    }
}


export const update = async (request: ProblemSetUpdateRequest): Promise<Result<ProblemSetBO>> => {
    const response = await axios.post<Result<ProblemSetBO>>(`${API_BASE_URL}/problemSet/update`, request);
    return response.data; 
};
