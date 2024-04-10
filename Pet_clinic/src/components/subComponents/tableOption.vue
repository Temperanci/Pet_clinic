<template>
    <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
            <span v-if="status[scope.$index] === 0">
                <el-button link type="primary" size="small"
                    @click="emit('select', scope.$index); status[scope.$index] = 1">Edit</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 2">Delete</el-button>
            </span>
            <span v-if="status[scope.$index] === 1">
                <el-button link type="primary" size="small" @click="emit('select', scope.$index);">confirm
                    edit</el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 0;emit('select', scope.$index);">cancel edit</el-button>
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
import { defineComponent, ref, defineEmits} from 'vue';
import type {Ref} from 'vue';
const component = defineComponent({
    name: "tableOption"
})
const emit = defineEmits(['select'])
const props = defineProps({
    Msg: schemas.BO,
    num:Number
})

function deleteRow(Msg:schemas.BO){

}
function editRow(Msg:schemas.BO){

}
function statusGen(num:number):Ref<number[]>{
    var temp = ref<number[]>([]);
    for(var i=0;i<num;i++){
        temp.value.push(0);
    }
    return temp;
}
const status = statusGen(props.num||0);//0：Edit/delete 1:edit=>confirm/cancel 2:delete=>confirm/cancel 
</script>
<script lang="ts">
export function isSelectGen(num:number):Ref<boolean[]>{
    var temp = ref<boolean[]>([]);
    for(var i=0;i<num;i++){
        temp.value.push(false);
    }
    console.log(temp);
    return temp;
}
</script>
<style scoped lang="scss"></style>
../../scripts/data.js../../scripts/paginate.js