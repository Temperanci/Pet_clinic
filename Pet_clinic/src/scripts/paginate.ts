import type {Ref} from 'vue'
export const LENGTH = 12;//页条目数

export class Table {
    tab: any[]
    constructor(t: any[]) {
        this.tab = t;
    }
}
export function selectPage(page: number, table: Table, data: Ref<any[]>,length?:number) {
    table.tab = [];
    let len=0;
    if(length){len=length;}
    else{len=LENGTH}
    if (page * len + len <= data.value.length) {
        // eslint-disable-next-line no-var
        for (var i = page * len; i < (page * len + len); i++) {
            table.tab.push(data.value[i]);
        }
    }
    else{
        // eslint-disable-next-line no-var
        for (var i = page * len; i < (data.value.length); i++) {
            table.tab.push(data.value[i]);
        }
    }

}
export function updateTab(currentPage: number, table: Table, data: Ref<any[]>, ctx: any,length?:number) {
    let len=0;
    if(length){len=length;}
    else{len=LENGTH}
    selectPage(currentPage - 1, table, data,len)
    ctx.$forceUpdate();
}

export function getPagination(num:number,length:number): number {
    return Math.ceil(num / length) * 10
}