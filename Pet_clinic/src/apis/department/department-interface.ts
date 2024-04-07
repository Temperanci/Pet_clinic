import { DepartmentBO } from "@/apis/schemas";

export interface DepartmentPageRequest {
    desc?: string;
    name?: string;
    picture?: string;
    location?: string;
    departmentId?: string;
}

export interface DepartmentPageResponse {
    datas: DepartmentBO[];
    total: number;
    limit: number;
}

export interface DepartmentUpdateRequest {
    DepartmentBO: DepartmentBO;
    delete?: boolean;
}
