// import type { AiTutorBO } from "@/apis/schemas";
import type {BasePageRequest} from "@/apis/page";
export interface AiTutorQuestionRequest extends BasePageRequest{
    question?: string;
}

export interface AiTutorResponse {
    answer?: string;
}

