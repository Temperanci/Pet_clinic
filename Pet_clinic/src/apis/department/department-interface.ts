import type { DepartmentBO } from "@/apis/schemas";

export interface DepartmentPageRequest {
    desc?: string;
    name?: string;
    picture?: string;
    location?: string;
    departmentId?: string;
    currPageNo?:number;
    limit?:number;
}

export interface DepartmentPageResponse {
    datas: DepartmentBO[];
    total: number;
    limit: number;
}

export interface DepartmentUpdateRequest {
    department: DepartmentBO;
    delete?: boolean;
}
