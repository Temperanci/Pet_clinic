import type { DiseaseContentBO } from "@/apis/schemas";

export interface DiseaseContentPageRequest {
    title?: string;
    content?: string;
    contentId?: string;
    diseaseId?: string;
}

export interface DiseaseContentPageResponse {
    datas: DiseaseContentBO[];
    total: number;
    limit: number;
}

export interface DiseaseContentUpdateRequest {
    DiseaseContentBO: DiseaseContentBO;
    delete?: boolean;
}