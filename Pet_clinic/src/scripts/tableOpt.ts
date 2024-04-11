export interface rowCRUD{
    updateMsg(Msg: Object[], data: any[], index: number):void
    deleteRow(Msg: Object[],index:number):void
    editRow(Msg: Object[],index:number):void
}