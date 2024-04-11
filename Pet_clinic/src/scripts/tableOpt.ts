export interface rowCRUD{
    updateMsg(msg: Object, data: any[], index: number):void
    deleteRow(Msg: Object[]):void
    editRow(Msg: Object[]):void
}