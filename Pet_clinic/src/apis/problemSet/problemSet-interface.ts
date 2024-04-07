import type { ProblemSetBO } from "@/apis/schemas";

export interface ProblemSetPageRequest {
    desc?: string;
    title?: string;
    endTime?: Date;
    duration?: number;
    startTime?: Date;
    whiteList?: string[];
    problemSetId?: string;
    problemIdList?: string[];
    problemScoreMap?: string;
}

export interface ProblemSetPageResponse {
    datas: ProblemSetBO[];
    total: number;
    limit: number;
}

export interface ProblemSetUpdateRequest {
    problemSet: ProblemSetBO;
    delete?: boolean;
}
