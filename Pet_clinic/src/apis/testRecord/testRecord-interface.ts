import type { TestRecordBO } from "@/apis/schemas";
import type { BasePageRequest } from "../page";

export interface TestRecordPageRequest extends BasePageRequest{
    graded?: boolean;
    gradeMap?: string;
    answerMap?: string;
    startTime?: Date;
    submitTime?: Date;
    candidateId?: string;
    problemSetId?: string;
    testRecordId?: string;
}

export interface TestRecordPageResponse {
    datas: TestRecordBO[];
    total: number;
    limit: number;
}

export interface TestRecordUpdateRequest {
    testRecord: TestRecordBO;
    delete?: boolean;
    submitted?: boolean;
}
