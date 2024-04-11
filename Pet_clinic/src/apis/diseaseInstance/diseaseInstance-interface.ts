import type { DiseaseInstanceBO } from "@/apis/schemas";
import type { BasePageRequest } from "../page";

export interface DiseaseInstancePageRequest extends BasePageRequest{
    desc?: string;
    time?: number;
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
    diseaseInstance: DiseaseInstanceBO;
    delete?: boolean;
}
