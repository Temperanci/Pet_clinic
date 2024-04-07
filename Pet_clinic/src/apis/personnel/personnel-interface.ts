import type { PersonnelBO } from "@/apis/schemas";

export interface PersonnelPageRequest {
    name?: string;
    role?: string;
    status?: string;
    password?: string;
    personnelId?: string;
    phoneNumber?: string;
    departmentId?: string;
}

export interface PersonnelPageResponse {
    datas: PersonnelBO[];
    total: number;
    limit: number;
}

export interface PersonnelUpdateRequest {
    personnel: PersonnelBO;
    delete?: boolean;
}
