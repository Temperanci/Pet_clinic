export class StorageToken {
    static set(key: string, value: any) {
        if(value!==null){
            localStorage.setItem(key, JSON.stringify(value));
        }
        else{
            localStorage.setItem(key, '');
        }
        
    }
    static get(key: string) {
        const temp: any = localStorage.getItem(key);
        if (temp !== undefined && temp !== '' && temp !== 'undefined') {
            console.log('StorageToken',temp)
            return JSON.parse(temp);
        }
        return null;
    }
}