import type { DiseaseInstanceBO } from "@/apis/schemas";

export interface DiseaseInstancePageRequest {
    desc?: string;
    time?: string;
    diseaseId?: string;
    instanceId?: string;
    fileUrlList?: string[];
    pictureUrlList?: string[];
}

export interface DiseaseInstancePageResponse {
    datas: DiseaseInstanceBO[];
    total: number;
    limit: number;
}

export interface DiseaseInstanceUpdateRequest {
    DiseaseInstanceBO: DiseaseInstanceBO;
    delete?: boolean;
}
