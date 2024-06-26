import type { StringLiteralType } from 'typescript';
import * as schemas from './schemas';
import { ku } from 'element-plus/es/locales.mjs';
import {type Ref,ref} from 'vue'
export class OptionItem{
    label:any;
    value:any;
}
export class BOTools{
    listToString(list:string[]){
        let str = '';
        if(list===null||list.length<=0) return str;
        str=list[0];
        for(let i=1;i<list.length;i++){
            str=str+','+list[i];
        }
        return str;
    }
    stringToList(str:string){
        let list:string[] = [];
        if(str===''||str===null) return list;
        return list=str.split(',');
    }
    formalDate(date:Date){
        let str = '';
        str=date.getFullYear+'-'+date.getMonth+'-'+date.getDate+','+date.getHours+':'+date.getMinutes+':'+date.getSeconds;   
        console.log('date is',str);
        return str;
    }
    batchMap(map:Map<any,any>,list:any[]){
        if(map===null||list===null||list.length<=0) return [];
        const res:string[]=[];
        for(let i =0;i<list.length;i++){
            res.push(map.get(list[i]));
        }
        // console.log('batchMap',res);
        return res;
    }
}
export class Bed implements schemas.BedBO{
    bedId: string;
    location: string;
    departmentId: string;
    occupation: boolean;
    constructor(){
        this.bedId=''
        this.location=''
        this.departmentId=''
        this.occupation=false
    }
    clear(){
        this.bedId='';
        this.location='';
        this.departmentId='';
        this.occupation=false
    }
}

export class Drug{
    drugId: string;
    name: string;
    type: string;
    diseaseIdList: string[];
    departmentId: string;
    desc: string;
    constructor(){
        this.departmentId='';
        this.type='';
        this.name='';
        this.drugId='';
        this.desc='';
        this.diseaseIdList=[];
    }
}

export class Price implements schemas.PriceBO{
    priceId: string;
    title: string;
    type: string;
    departmentId: string;
    desc: string;
    serviceId: string;
    price: number;

    constructor(){
        this.price=0;
        this.priceId='';
        this.title='';
        this.type='';
        this.departmentId='';
        this.desc='';
        this.serviceId='';
    }
}

export class DiseaseInstance {
    desc: string;
    time: number;
    diseaseId: string;
    instanceId: string;
    fileUrlList: string[];
    fileOptions:Ref<OptionItem[]>
    pictureUrlList: string[];
    pictureOptions:Ref<OptionItem[]>
    form:any;
    constructor(){
        this.desc='';
        this.time=0;
        this.diseaseId='';
        this.instanceId='';
        this.fileUrlList=[];
        this.pictureUrlList=[];
        this.fileOptions=ref<OptionItem[]>([]);
        this.pictureOptions=ref<OptionItem[]>([]);
        this.form = {
            fileList: [], // 这里假设 fileList 是 File 类型的数组
            videoList: [], // 同上，videoList 是 File 类型的数组
          }
    }
}

export class Department {
    departmentId: string;
    desc: string ;
    picture: string;
    location: string;
    name: string;
    picOptions:Ref<OptionItem[]>
    uploadFile:FormData;
    constructor(){
        this.departmentId='';
        this.desc='';
        this.picture='';
        this.location='';
        this.name='';
        this.picOptions=ref<OptionItem[]>([]);
        this.uploadFile=new FormData();
    }
}

export class Personnel implements schemas.PersonnelBO{
    name: string;
    role: string;
    status: string;
    password: string;
    personnelId: string;
    phoneNumber: string;
    departmentId: string;
    constructor(){
        this.name='';
        this.role='';
        this.status='';
        this.password='';
        this.personnelId='';
        this.phoneNumber='';
        this.departmentId='';
    }
}

export class Disease implements schemas.DiseaseBO{
    desc: string;
    name: string;
    diseaseId: string;
    fileUrlList: string[];
    departmentId: string;
    pictureUrlList: string[];
    constructor(){
        this.desc='';
        this.name='';
        this.diseaseId='';
        this.fileUrlList=[];
        this.departmentId='';
        this.pictureUrlList=[];
    }
}

export class Problem implements schemas.ProblemBO{
    type: string;
    title: string;
    answer: string;
    content: string;
    problemId: string;
    subjectId: string;
    background: string;
    gradingPoints: string;
    constructor(){
        this.type='';
        this.title='';
        this.answer='';
        this.content='';
        this.problemId='';
        this.subjectId='';
        this.background='';
        this.gradingPoints='';
    }
}

export class ProblemSet implements schemas.ProblemSetBO{
    problemSetId: string;
    desc: string | undefined;
    title: string;
    endTime: Date;
    duration: number;
    startTime: Date;
    whiteList: string[];
    problemIdList: string[];
    problemScoreMap: Record<string, number>;
    constructor(){
        this.problemSetId='';
        this.desc='';
        this.title='';
        this.endTime=new Date();
        this.duration=0;
        this.startTime=new Date();
        this.whiteList=[];
        this.problemIdList=[];
        this.problemScoreMap={};
    }
}

export class TestRecord implements schemas.TestRecordBO {
    score: number;
    graded: boolean;
    gradeMap: Record<string, schemas.GradeResultBO>;
    answerMap: Record<string, string>;
    startTime: Date;
    submitted: boolean;
    answerList: string[];
    submitTime: Date;
    candidateId: string;
    problemSetId: string;
    testRecordId: string;
    constructor() {
        this.score = 0;
        this.graded = false;
        this.gradeMap = {};
        this.answerMap = {};
        this.startTime = new Date();
        this.submitted = false;
        this.answerList = [];
        this.submitTime = new Date();
        this.candidateId = '';
        this.problemSetId = '';
        this.testRecordId = '';
    }
}

export class DiseaseContent{
    title:string;
    content:string;
    contentId:string;
    diseaseId:string;
    indexStatus:string;
    constructor(){
        this.content = '';
        this.title = '';
        this.contentId = '';
        this.diseaseId = '';
        this.indexStatus = '';
    }
}

