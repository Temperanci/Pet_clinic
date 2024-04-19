import type { DepartmentBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface DepartmentPageRequest extends BasePageRequest{
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
    department: DepartmentBO;
    delete?: boolean;
}

export interface DepartmentUploadRequest{
    formdata:FormData;
}