import type { DrugBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface DrugPageRequest extends BasePageRequest{
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
