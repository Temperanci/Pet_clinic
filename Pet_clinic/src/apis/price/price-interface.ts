import type { PriceBO } from "@/apis/schemas";

export interface PricePageRequest {
    desc?: string;
    type?: string;
    price?: number;
    title?: string;
    priceId?: string;
    serviceId?: string;
    departmentId?: string;
}

export interface PricePageResponse {
    datas: PriceBO[];
    total: number;
    limit: number;
}

export interface PriceUpdateRequest {
    price: PriceBO;
    delete?: boolean;
}
