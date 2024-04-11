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