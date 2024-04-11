import type { DiseaseInstanceBO } from "@/apis/schemas";

export interface DiseaseInstancePageRequest {
    desc?: string;
    time?: number;
    diseaseId?: string;
    instanceId?: string;
    fileUrlList?: string[];
    pictureUrlList?: string[];
    currPageNo?:number;
    limit?:number;
}

export interface DiseaseInstancePageResponse {
    datas: DiseaseInstanceBO[];
    total: number;
    limit: number;
}

export interface DiseaseInstanceUpdateRequest {
    diseaseInstance: DiseaseInstanceBO;
    delete?: boolean;
}
