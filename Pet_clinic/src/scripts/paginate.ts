const LENGTH = 16;//页条目数
export class Table {
    tab: any[]
    constructor(t: any[]) {
        this.tab = t;
    }
}
export function selectPage(page: number, table: Table, data: any[],length?:number) {
    table.tab = [];
    var len=0;
    if(length){len=length;}
    else{len=LENGTH}
    if (page * len + len <= data.length) {
        for (var i = page * len; i < (page * len + len); i++) {
            table.tab.push(data[i]);
        }
    }
    else{
        for (var i = page * len; i < (data.length); i++) {
            table.tab.push(data[i]);
        }
    }

}
export function updateTab(currentPage: number, table: Table, data: any[], ctx: any,length?:number) {
    var len=0;
    if(length){len=length;}
    else{len=LENGTH}
    selectPage(currentPage - 1, table, data,len)
    ctx.$forceUpdate();
}
export function getPagination(data: any[],length?:number): number {
    var len=0;
    if(length){len=length;}
    else{len=LENGTH}
    console.log(Math.ceil(data.length / len) * 10)
    return Math.ceil(data.length / len) * 10
}//获取分页数