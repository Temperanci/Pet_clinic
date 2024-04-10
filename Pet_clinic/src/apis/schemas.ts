export class BO{
    constructor(){
        
    }
}
export interface BedBO extends BO{
    bedId: string;
    location: string;
    departmentId: string;
}

export interface DepartmentBO extends BO{
    desc: string;
    name: string;
    picture: string;
    location: string;
    departmentId: string;
}

export interface DiseaseContentBO extends BO{
    title: string;
    content: string;
    contentId: string;
    diseaseId: string;
}

export interface DiseaseBO extends BO{
    desc: string;
    name: string;
    diseaseId: string;
    fileUrlList: string[];
    departmentId: string;
    pictureUrlList: string[];
}

export interface DiseaseInstanceBO extends BO{
    desc: string;
    time: string;
    diseaseId: string;
    instanceId: string;
    fileUrlList: string[];
    pictureUrlList: string[];
}

export interface DrugBO extends BO{
    desc: string;
    name: string;
    type: string;
    drugId: string;
    departmentId: string;
    diseaseIdList: string[];
}

export interface PersonnelBO extends BO{
    name: string;
    role: string;
    status: string;
    password: string;
    personnelId: string;
    phoneNumber: string;
    departmentId: string;
}

export interface PriceBO extends BO{
    desc: string;
    type: string;
    price: number;
    title: string;
    priceId: string;
    serviceId: string;
    departmentId: string;
}

export interface ProblemBO extends BO{
    type: string;
    title: string;
    answer: string;
    content: string;
    problemId: string;
    subjectId: string;
    background: string;
    gradingPoints: string;
}

export interface ProblemSetBO extends BO{
    desc: string;
    title: string;
    endTime: Date;
    duration: number;
    startTime: Date;
    whiteList: string[];
    problemSetId: string;
    problemIdList: string[];
    problemScoreMap: Record<string, number>;
}

export interface ProcessBO extends BO{
    type: string;
    title: string;
    content: string;
    processId: string;
}

export interface TestRecordBO extends BO{
    score: number;
    graded: boolean;
    gradeMap: Record<string, GradeResultBO>;
    answerMap: Record<string, string>;
    startTime: Date;
    submitted: boolean;
    answerList: string[];
    submitTime: Date;
    candidateId: string;
    problemSetId: string;
    testRecordId: string;
}

// 假设还需要创建 GradeResultBO 接口
export interface GradeResultBO extends BO{
    scores: number;
    reason: string;
}
