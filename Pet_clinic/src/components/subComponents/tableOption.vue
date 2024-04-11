<template>
    <el-table-column fixed="right" label="Operations" width="120">
        <template #header>
            <el-button link type="primary" size="small" @click="create">创建</el-button>
            <el-button v-if="searchPage" link type="primary" size="small" @click="back">返回</el-button>
            <el-button v-else link type="primary" size="small" @click="search">搜索</el-button>
        </template>
        <template #default="scope">
            <span v-if="status[scope.$index] === 0">
                <el-button link type="primary" size="small"
                    @click="emit('edit', scope.$index); status[scope.$index] = 1">Edit</el-button>
                <el-button link type="primary" size="small"
                    @click="emit('delete', scope.$index); status[scope.$index] = 2;">Delete</el-button>
            </span>
            <span v-if="status[scope.$index] === 1">
                <el-button link type="primary" size="small" @click="editConfirm(scope.$index);">Confirm
                </el-button>
                <el-button link type="primary" size="small"
                    @click="status[scope.$index] = 0; emit('cancel', scope.$index);">Cancel</el-button>
            </span>
            <span v-if="status[scope.$index] === 2">
                <el-button link type="primary" size="small"
                    @click="emit('deleteConfirm', scope.$index); status[scope.$index] = 0;">Confirm
                </el-button>
                <el-button link type="primary" size="small" @click="status[scope.$index] = 0">Cancel</el-button>
            </span>
            <span v-if="status[scope.$index] === 3">
                <el-button link type="primary" size="small"
                    @click="emit('createConfirm', scope.$index); status[scope.$index] = 0;">Confirm
                </el-button>
                <el-button link type="primary" size="small" @click="cancel(scope.$index)">Cancel</el-button>
            </span>
            <span v-if="status[scope.$index] === 4">
                <el-button link type="primary" size="small"
                    @click="emit('searchConfirm', scope.$index); status[scope.$index] = 0;">Confirm
                </el-button>
                <el-button link type="primary" size="small" @click="cancel(scope.$index)">Cancel</el-button>
            </span>
        </template>
    </el-table-column>
</template>

<script setup lang="ts">
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
    'createConfirm',
    'searchConfirm',
    'create',
    'search',
    'back'
])
const props = defineProps({
    num: Number,
    clear: Boolean,
    back:Boolean
})
function statusGen(num: number): Ref<number[]> {
    var temp = ref<number[]>([]);
    for (var i = 0; i < num; i++) {
        temp.value.push(0);
    }
    return temp;
}
var status: Ref<number[]> = statusGen(props.num || 0);//0：Edit/delete 1:edit=>confirm/cancel 2:delete=>confirm/cancel 3:create=>confirm/cancel
function editConfirm(index: number) {
    emit('editConfirm', index);
    emit('edit', index);
    status.value[index] = 0;
}
function clearStatus() {
    status = statusGen(props.num || 0);
}
function create() {
    status.value[0] = 3;
    emit('create',0);
}
function search(){
    status.value[0] = 4;
    emit('search',0);
}
var searchPage=ref(false);
function back(){
    searchPage.value=false;
    emit('back');
}
function cancel(index:number){
    status.value[index] = 0;
    emit('cancel', index);
}
watch(() => props.clear, (newVal) => {
    if (newVal) {
        clearStatus();
        console.log('clearStatus', status);
    }
})
watch(() => props.num, (newVal) => {
    status = statusGen(props.num || 0);
})
watch(()=>props.back,(newVal)=>{
    if(newVal){
        searchPage.value=true;
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
export function clearIsSelected(isSelected: Ref<boolean[]>) {
    for (var i = 0; i < isSelected.value.length; i++) {
        isSelected.value[i] = false;
    }
    return isSelected;
}
</script>
<style scoped lang="scss"></style>
../../scripts/data.js../../scripts/paginate.js