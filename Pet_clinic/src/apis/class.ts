import * as schemas from './schemas.ts';
export class Bed implements schemas.BedBO{
    bedId: string;
    location: string;
    departmentId: string;
    constructor(){
        this.bedId=''
        this.location=''
        this.departmentId=''
    }
    clear(){
        this.bedId='';
        this.location='';
        this.departmentId='';
    }
}

export class Drug implements schemas.DrugBO{
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
        this.diseaseIdList=[]
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

export class DiseaseInstance implements schemas.DiseaseInstanceBO{
    desc: string;
    time: number;
    diseaseId: string;
    instanceId: string;
    fileUrlList: string[];
    pictureUrlList: string[];
    constructor(){
        this.desc='';
        this.time=0;
        this.diseaseId='';
        this.instanceId='';
        this.fileUrlList=[];
        this.pictureUrlList=[];
    }
}

export class Department implements schemas.DepartmentBO{
    departmentId: string;
    desc: string ;
    picture: string;
    location?: string;
    name?: string;
    constructor(){
        this.departmentId='';
        this.desc='';
        this.picture='';
        this.picture='';
        this.name='';
    }
}