import type { DrugBO } from "@/apis/schemas";

export interface DrugPageRequest {
    desc?: string;
    name?: string;
    type?: string;
    drugId?: string;
    departmentId?: string;
    diseaseId?: string;
}

export interface DrugPageResponse {
    datas: DrugBO[];
    total: number;
    limit: number;
}

export interface DrugUpdateRequest {
    drug: DrugBO;
    delete?: boolean;
}
