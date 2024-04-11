<template>
    <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
            <span v-if="status[scope.$index] === 0">
                <el-button link type="primary" size="small"
                    @click="emit('select', scope.$index); status[scope.$index] = 1">Edit</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 2">Delete</el-button>
            </span>
            <span v-if="status[scope.$index] === 1">
                <el-button link type="primary" size="small"
                    @click="confirmEdit(scope.$index);">confirm
                    edit</el-button>
                <el-button link type="primary" size="small"
                    @click="status[scope.$index] = 0; emit('select', scope.$index);">cancel edit</el-button>
            </span>
            <span v-if="status[scope.$index] === 2">
                <el-button link type="primary" size="small" @click="emit('select', scope.$index);">confirm
                    delete</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 0">cancel delete</el-button>
            </span>
        </template>
    </el-table-column>
</template>

<script setup lang="ts">
import * as schemas from '../../apis/schemas.ts'
import * as Cl from '../../apis/class.ts'
import { defineComponent, ref, defineEmits } from 'vue';
import type { Ref } from 'vue';
const component = defineComponent({
    name: "tableOption"
})
const emit = defineEmits(['select'])
const props = defineProps({
    Msg: Array<Object>,
    num: Number,
    Data: Array<any>,
    type:String
})
// TODO:
function confirmEdit(index:number){
    emit('select', index); 
    updateMsg((props.Msg||[])[index],props.Data||[],index,props.type||''); 
    console.log('out func', props.Msg || []);
}
function updateMsg(msg: Object, data: any[], index: number,type:string) {
    switch(type) {
        case "BedBO":
        (msg as Cl.Bed).bedId = data[index].bedId;
        (msg as Cl.Bed).location = data[index].location;
        (msg as Cl.Bed).departmentId = data[index].departmentId;
        break;
    }
}
function deleteRow(Msg: schemas.BO[]) {

}
function editRow(Msg: schemas.BO[]) {

}
function statusGen(num: number): Ref<number[]> {
    var temp = ref<number[]>([]);
    for (var i = 0; i < num; i++) {
        temp.value.push(0);
    }
    return temp;
}
const status = statusGen(props.num || 0);//0：Edit/delete 1:edit=>confirm/cancel 2:delete=>confirm/cancel 
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
</script>
<style scoped lang="scss"></style>
../../scripts/data.js../../scripts/paginate.js