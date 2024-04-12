import type { ProblemBO } from "@/apis/schemas";
import type { BasePageRequest } from "../page";

export interface ProblemPageRequest extends BasePageRequest{
    type?: string;
    title?: string;
    answer?: string;
    content?: string;
    problemId?: string;
    subjectId?: string;
    background?: string;
    gradingPoints?: string;
}

export interface ProblemPageResponse {
    datas: ProblemBO[];
    total: number;
    limit: number;
}

export interface ProblemUpdateRequest {
    problem: ProblemBO;
    delete?: boolean;
}
