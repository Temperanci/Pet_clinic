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
}