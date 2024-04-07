import type { BedBO } from "@/apis/schemas";

export interface BedPageRequest {
    bedId?: string;
    location?: string;
    departmentId?: string;
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
