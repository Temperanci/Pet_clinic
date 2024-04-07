const len = 16;//页条目数
export class Table {
    tab: any[]
    constructor(t: any[]) {
        this.tab = t;
    }
}
export function selectPage(page: number, table: Table, data: any[]) {
    table.tab = [];
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
export function updateTab(currentPage: number, table: Table, data: any[], ctx: any) {
    selectPage(currentPage - 1, table, data)
    ctx.$forceUpdate();
}
export function getPagination(data: any[]): number {
    console.log(Math.ceil(data.length / len) * 10)
    return Math.ceil(data.length / len) * 10
}//获取分页数