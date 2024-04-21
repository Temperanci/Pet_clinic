import type { BedBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface BedPageRequest extends BasePageRequest{
    bedId?: string;
    location?: string;
    departmentId?: string;
    occupation?: boolean;
}

export interface BedPageResponse {
    datas: BedBO[];
    total: number;
    limit: number;
}

export interface BedUpdateRequest {
    bed: BedBO;
    delete?: boolean;
}
