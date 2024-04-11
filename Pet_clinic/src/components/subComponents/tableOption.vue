<template>
    <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
            <span v-if="status[scope.$index] === 0">
                <el-button link type="primary" size="small"
                    @click="emit('edit', scope.$index); status[scope.$index] = 1">Edit</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 2">Delete</el-button>
            </span>
            <span v-if="status[scope.$index] === 1">
                <el-button link type="primary" size="small"
                    @click="editConfirm(scope.$index);">confirm
                    </el-button>
                <el-button link type="primary" size="small"
                    @click="status[scope.$index] = 0; emit('cancel', scope.$index);">cancel</el-button>
            </span>
            <span v-if="status[scope.$index] === 2">
                <el-button link type="primary" size="small" @click="emit('delete', scope.$index);">confirm
                    delete</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 0">cancel delete</el-button>
            </span>
        </template>
    </el-table-column>
</template>

<script setup lang="ts">
import * as schemas from '../../apis/schemas.ts'
import * as Cl from '../../apis/class.ts'
import { defineComponent, ref, defineEmits, watch } from 'vue';
import type { Ref } from 'vue';
const component = defineComponent({
    name: "tableOption"
})
const emit = defineEmits([
    'edit',
    'cancel',
    'delete',
    'editConfirm',
    'deleteConfirm',    
])
const props = defineProps({
    num: Number,
    clear:Boolean
})
function statusGen(num: number): Ref<number[]> {
    var temp = ref<number[]>([]);
    for (var i = 0; i < num; i++) {
        temp.value.push(0);
    }
    return temp;
}
var status:Ref<number[]> = statusGen(props.num || 0);//0：Edit/delete 1:edit=>confirm/cancel 2:delete=>confirm/cancel 
function editConfirm(index:number){
    emit('editConfirm', index);
    emit('edit', index);
    status.value[index] = 0;
}
function clearStatus(){
    status = statusGen(props.num || 0);
}
watch(()=>props.clear,(newVal)=>{
    if(newVal){
        clearStatus();
        console.log('clearStatus',status);
    }
})
</script>
<script lang="ts">
export function EditedGen(num: number, obj: Object): Object[] {
    var temp: Object[] = [];
    for (var i = 0; i < num; i++) {
        temp.push(Object.assign({}, obj));
    }
    console.log(temp);
    return temp;
}
export function isSelectGen(num: number): Ref<boolean[]> {
    var temp = ref<boolean[]>([]);
    for (var i = 0; i < num; i++) {
        temp.value.push(false);
    }
    console.log(temp);
    return temp;
}
export function clearIsSelected(isSelected:Ref<boolean[]>){
    for(var i =0;i<isSelected.value.length;i++){
        isSelected.value[i] = false;
    }
    return isSelected;
}
</script>
<style scoped lang="scss"></style>
../../scripts/data.js../../scripts/paginate.js