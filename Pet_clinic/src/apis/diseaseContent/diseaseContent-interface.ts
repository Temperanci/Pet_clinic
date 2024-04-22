import type { DiseaseContentBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface DiseaseContentPageRequest extends BasePageRequest{
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
    diseaseContent: DiseaseContentBO;
    delete?: boolean;
}
