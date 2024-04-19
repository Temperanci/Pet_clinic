import { ElMessage } from 'element-plus'
export function ColumnDisplay(column:any){
    if(column===undefined||column===null||column==='') return '无';
    return column;
}
const URL=''
export function nameToUrl(name:string){
    return URL+name;
}
export function urlToName(url:string){
    return url.split('/').pop;
}
export function stringToDate(str:string){
    const num:number = +str;
    const date = new Date(num);
    //用formdate格式化日期和时间，使其以两位的形式表示
    return date.getFullYear()
    +'-'
    +formDate((date.getMonth()+1))
    +'-'
    +formDate(date.getDate())
    +' '
    +formDate(date.getHours())
    +':'
    +formDate(date.getMinutes());
}
export function formDate(num:number){
    return num>=10?num:'0'+num;
}
export function throwMessage(str:string){
    switch(str){
        case 'update success':
            ElMessage({
                message: '更改成功',
                type: 'success',
              });
            break;
        case 'update fail':
            ElMessage({
                message: '更改失败',
                type: 'error',
            })
            break;
        case 'delete success':
            ElMessage({
                message: '删除成功',
                type: 'success',
            })
            break;
        case 'delete fail':
            ElMessage({
                message: '删除失败',
                type: 'error',
            })
            break;
        case 'create success':
            ElMessage({
                message: '创建成功',
                type: 'success',
            })
            break;
        case 'create fail':
            ElMessage({
                message: '创建失败',
                type: 'error',
            })
            break;
        case 'error':
            break;
    }
}