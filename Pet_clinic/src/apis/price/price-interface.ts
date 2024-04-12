import type { PriceBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface PricePageRequest extends BasePageRequest{
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
