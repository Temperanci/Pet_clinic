export interface rowCRUD{
    updateMsg(Msg: Object[], data: any[], index: number):any
    deleteRow(Msg: Object[],index:number):any
    editRow(Msg: Object[],index:number):any
    createRow(msg:Object):any
    search(msg:Object):any
}