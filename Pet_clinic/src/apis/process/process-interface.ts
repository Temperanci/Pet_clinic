import type { ProcessBO } from "@/apis/schemas";

export interface ProcessPageRequest {
    type?: string;
    title?: string;
    content?: string;
    processId?: string;
}

export interface ProcessPageResponse {
    datas: ProcessBO[];
    total: number;
    limit: number;
}

export interface ProcessUpdateRequest {
    process: ProcessBO;
    delete?: boolean;
}
