export interface rowCRUD{
    updateMsg(Msg: Object[], data: any[], index: number):void
    deleteRow(Msg: Object[],index:number):void
    editRow(Msg: Object[],index:number):void
    createRow(msg:Object):void
    search(msg:Object):void
}