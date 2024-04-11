import type { DiseaseBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface DiseasePageRequest extends BasePageRequest{
    desc?: string;
    name?: string;
    diseaseId?: string;
    fileUrlList?: string[];
    departmentId?: string;
    pictureUrlList?: string[];
}

export interface DiseasePageResponse {
    datas: DiseaseBO[];
    total: number;
    limit: number;
}

export interface DiseaseUpdateRequest {
    DiseaseBO: DiseaseBO;
    delete?: boolean;
}
